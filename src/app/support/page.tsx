'use client';

import { useEffect, useState } from 'react';
import { Heart, ShieldCheck, Calendar, CreditCard, QrCodeIcon, CheckCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import Link from 'next/link';

interface Donation {
  id: number;
  amount: number;
  donorName: string;
  status: string;
  createdAt: string;
}

interface Stats {
  totalRaised: number;
  donorCount: number;
  remaining: number;
  goal: number;
  progressPercent: number;
}

const SBP_LINK = "https://qr.nspk.ru/AS1A001RM6B8DC269O4R2PCTEJJRBAI0?type=01&bank=100000000111&crc=70AD";

export default function SupportPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentDonations, setRecentDonations] = useState<Donation[]>([]);
  const [isRecurring, setIsRecurring] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [amount, setAmount] = useState('1000');
  const [customAmount, setCustomAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [donorEmail, setDonorEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const fallbackStats: Stats = {
    totalRaised: 0,
    donorCount: 0,
    remaining: 10000000,
    goal: 10000000,
    progressPercent: 0,
  };

  const fallbackDonations: Donation[] = [];

  useEffect(() => {
    fetch('/api/stats')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(() => setStats(fallbackStats));

    fetch('/api/donations?status=succeeded&limit=20&offset=0')
      .then(res => res.json())
      .then(data => {
        if (!data.error && data.donations) {
          setRecentDonations(data.donations);
        } else {
          setRecentDonations([]);
        }
      })
      .catch(() => setRecentDonations([]));
  }, []);

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('ru-RU').format(num);
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diff < 60) return 'только что';
    if (diff < 3600) return `${Math.floor(diff / 60)} мин назад`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} ч назад`;
    return format(date, 'dd.MM.yyyy');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      if (paymentMethod === 'sbp') {
        window.open(SBP_LINK, '_blank');
        return;
      }

      const res = await fetch('/api/donations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: parseFloat(customAmount || amount),
          donorName: isAnonymous ? 'Аноним' : 'Брат/Сестра',
          donorEmail: donorEmail,
          isRecurring,
          recurringPeriod: isRecurring ? 'monthly' : null,
        }),
      });

      const data = await res.json();
      if (data.confirmationUrl) {
        window.location.href = data.confirmationUrl;
      } else {
        setError(data.error || 'Произошла ошибка');
      }
    } catch (err) {
      setError('Проверьте подключение к интернету');
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayStats = stats || fallbackStats;

  return (
    <div className="bg-bg min-h-screen py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          {/* Left: Progress and Stats */}
          <div className="lg:col-span-2 space-y-12">
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <h1 className="font-display font-bold text-4xl text-[#1C1C1E] mb-8">Подробнее о сборе</h1>

              {/* Progress Bar */}
              <div className="mb-8">
                <div className="flex justify-between mb-4">
                  <div className="text-sm font-bold text-[#6B6B6B]">Собрано</div>
                  <div className="text-sm font-bold text-[#6B6B6B]">Цель</div>
                </div>
                <div className="flex items-baseline gap-4 mb-4">
                  <div className="text-4xl font-extrabold text-primary">
                    {formatNumber(Math.floor(displayStats.totalRaised))} ₽
                  </div>
                  <div className="text-2xl font-bold text-[#6B6B6B]">из {formatNumber(displayStats.goal)} ₽</div>
                </div>
                <div className="w-full h-4 bg-border rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full"
                    style={{ width: `${Math.min(displayStats.progressPercent, 100)}%` }}
                  ></div>
                </div>
                <div className="mt-4 text-right text-sm font-bold text-[#6B6B6B]">
                  {displayStats.progressPercent}% выполнено
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                <div className="p-6 bg-primary-light rounded-xl">
                  <div className="text-2xl font-extrabold text-primary mb-1">{formatNumber(displayStats.donorCount)}</div>
                  <div className="text-sm font-bold text-[#6B6B6B]">Жертвователей</div>
                </div>
                <div className="p-6 bg-primary-light rounded-xl">
                  <div className="text-2xl font-extrabold text-primary mb-1">{formatNumber(Math.floor(displayStats.remaining))} ₽</div>
                  <div className="text-sm font-bold text-[#6B6B6B]">Осталось собрать</div>
                </div>
                <div className="p-6 bg-primary-light rounded-xl">
                  <div className="text-2xl font-extrabold text-primary mb-1">{formatNumber(Math.floor(displayStats.totalRaised / displayStats.donorCount))} ₽</div>
                  <div className="text-sm font-bold text-[#6B6B6B]">Средняя сумма</div>
                </div>
              </div>
            </div>

            {/* Donation Feed */}
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <h2 className="font-display font-bold text-2xl text-[#1C1C1E] mb-8">Все поступления</h2>
              <div className="space-y-4">
                {recentDonations.map((donation) => (
                <div key={donation.id} className="flex items-center justify-between p-6 bg-bg rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center text-primary font-extrabold">
                      {donation.donorName.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-[#1C1C1E]">{donation.donorName}</div>
                      <div className="text-sm text-[#6B6B6B]">{getTimeAgo(donation.createdAt)}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-extrabold text-primary text-xl">
                      {formatNumber(Math.floor(donation.amount))} ₽
                    </div>
                  </div>
                </div>
              ))}
              </div>
            </div>
          </div>

          {/* Right: Donation Form */}
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-2xl shadow-lg sticky top-24">
              <h2 className="font-display font-bold text-2xl text-[#1C1C1E] mb-6">Помочь сейчас</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Type Toggle */}
                <div className="flex bg-bg p-1 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setIsRecurring(false)}
                    className={`flex-1 py-3 text-sm font-bold rounded-md transition-colors ${!isRecurring ? 'bg-primary text-white' : 'text-[#6B6B6B] hover:text-[#1C1C1E]'}`}
                  >
                    Единоразово
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsRecurring(true)}
                    className={`flex-1 py-3 text-sm font-bold rounded-md transition-colors ${isRecurring ? 'bg-primary text-white' : 'text-[#6B6B6B] hover:text-[#1C1C1E]'}`}
                  >
                    Регулярно
                  </button>
                </div>

                {/* Anonymous Checkbox */}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsAnonymous(!isAnonymous)}
                    className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                      isAnonymous ? 'bg-primary border-primary text-white' : 'border-border'}`}
                  >
                    {isAnonymous && <CheckCircle size={14} />}
                  </button>
                  <span className="text-sm font-semibold text-[#6B6B6B]">Анонимно</span>
                </div>

                {/* Amount */}
                <div className="space-y-3">
                  <label className="text-sm font-bold text-[#6B6B6B] uppercase tracking-widest">Сумма пожертвования</label>
                  <div className="grid grid-cols-4 gap-3">
                    {['100', '500', '1000'].map(amt => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => { setAmount(amt); setCustomAmount(''); }}
                        className={`py-3 rounded-lg border-2 font-bold transition-colors ${
                          !customAmount && amount === amt
                            ? 'border-primary bg-primary-light text-primary'
                            : 'border-border text-[#6B6B6B] hover:border-primary hover:text-primary'
                        }`}
                      >
                        {amt} ₽
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => { setAmount(''); setCustomAmount(''); }}
                      className={`py-3 rounded-lg border-2 font-bold transition-colors ${
                        customAmount || !['100', '500', '1000'].includes(amount)
                          ? 'border-primary bg-primary-light text-primary'
                          : 'border-border text-[#6B6B6B] hover:border-primary hover:text-primary'
                      }`}
                    >
                      Своя
                    </button>
                  </div>
                  {(customAmount || !['100', '500', '1000'].includes(amount)) && (
                    <input
                      type="number"
                      value={customAmount}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9]/g, '');
                        setCustomAmount(value);
                        setAmount(value);
                      }}
                      placeholder="Введите свою сумму"
                      className="w-full bg-bg border-2 border-border rounded-lg px-4 py-3 font-bold text-[#1C1C1E] focus:outline-none focus:border-primary"
                    />
                  )}
                </div>

                {/* Payment Methods */}
                <div className="flex gap-4 pt-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                      paymentMethod === 'card' ? 'border-primary bg-primary-light text-primary' : 'border-border text-[#6B6B6B]'
                    }`}
                  >
                    <CreditCard size={18} />
                    <span className="text-sm font-semibold">Карта</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('sbp')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                      paymentMethod === 'sbp' ? 'border-primary bg-primary-light text-primary' : 'border-border text-[#6B6B6B]'
                    }`}
                  >
                    <QrCodeIcon size={18} />
                    <span className="text-sm font-semibold">СБП</span>
                  </button>
                </div>

                {/* Email */}
                <input
                  type="email"
                  value={donorEmail}
                  onChange={(e) => setDonorEmail(e.target.value)}
                  placeholder="Email для чека (необязательно)"
                  className="w-full bg-bg border-2 border-border rounded-lg px-4 py-3 font-semibold text-[#1C1C1E] focus:outline-none focus:border-primary"
                />

                {/* Benefits */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-3 text-sm">
                    <ShieldCheck size={16} className="text-primary" />
                    <span className="text-[#6B6B6B]">Безопасная оплата</span>
                  </div>
                  {isRecurring && (
                    <div className="flex items-center gap-3 text-sm">
                      <Calendar size={16} className="text-primary" />
                      <span className="text-[#6B6B6B]">Отмена в любой момент</span>
                    </div>
                  )}
                </div>

                {error && <div className="p-4 bg-red-50 text-red-600 text-sm font-bold rounded-lg text-center">{error}</div>}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full justify-center py-4 text-lg"
                >
                  {isSubmitting ? 'Подождите...' : 'Поддержать мечеть'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
