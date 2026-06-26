'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import {
  Users,
  CheckCircle,
  ArrowRight,
  ChevronRight,
  XCircle,
  X,
  ShieldCheck,
  RefreshCw,
  Calendar,
  Heart,
  CreditCard,
  QrCodeIcon,
  Clock,
} from 'lucide-react';

interface PrayerSchedule {
  fajr: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  juma: string;
}

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

const galleryPhotos = [
  { src: '/media/Главный_план.jpg', alt: 'Главный план мечети' },
  { src: '/media/Доп_фотка_помещение.jpg', alt: 'Помещение мечети' },
  { src: '/media/Доп_фотка2_помещение.jpg', alt: 'Интерьер мечети' },
];

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [schedule, setSchedule] = useState<PrayerSchedule | null>(null);
  const [nextPrayer, setNextPrayer] = useState<{ name: string; time: string; remaining: string } | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentDonations, setRecentDonations] = useState<Donation[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [donationLimit, setDonationLimit] = useState(8);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  
  // Widget state
  const [isRecurring, setIsRecurring] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [amount, setAmount] = useState('500');
  const [customAmount, setCustomAmount] = useState('');
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [lightboxPhoto, setLightboxPhoto] = useState<{ src: string; alt: string } | null>(null);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [donorEmail, setDonorEmail] = useState('');
  const [widgetError, setWidgetError] = useState('');
  const [consentGiven, setConsentGiven] = useState(false);
  const [showRecurringConfirm, setShowRecurringConfirm] = useState(false);

  // Carousel state
  const [currentSlide, setCurrentSlide] = useState(0);

  const fallbackStats: Stats = {
    totalRaised: 0,
    donorCount: 0,
    remaining: 10000000,
    goal: 10000000,
    progressPercent: 0,
  };

  const fallbackSchedule: PrayerSchedule = {
    fajr: '04:30',
    dhuhr: '13:00',
    asr: '17:00',
    maghrib: '21:00',
    isha: '22:30',
    juma: '13:00',
  };

  const fallbackDonations: Donation[] = [];

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    fetch('/api/schedule')
      .then(res => res.json())
      .then(data => {
        if (!data.error) setSchedule(data);
        else setSchedule(fallbackSchedule);
      })
      .catch(() => setSchedule(fallbackSchedule));

    fetch('/api/stats')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(() => setStats(fallbackStats));

    fetch('/api/events')
      .then(res => res.json())
      .then(data => {
        if (!data.error) setEvents(data);
      })
      .catch(() => {});

    loadDonations(8, 0);
  }, []);

  const loadDonations = (limit: number, offset: number) => {
    fetch(`/api/donations?status=succeeded&limit=${limit}&offset=${offset}`)
      .then(res => res.json())
      .then(data => {
        if (!data.error && data.donations) {
          setRecentDonations(data.donations);
        } else {
          setRecentDonations([]);
        }
      })
      .catch(() => setRecentDonations([]));
  };

  const loadMoreDonations = () => {
    setIsLoadingMore(true);
    const newLimit = donationLimit + 8;
    setDonationLimit(newLimit);
    loadDonations(newLimit, 0);
    setTimeout(() => {
      setIsLoadingMore(false);
    }, 300);
  };

  useEffect(() => {
    if (!schedule) return;

    const calcNextPrayer = () => {
      const now = new Date();
      const prayers = [
        { name: 'Фаджр', time: schedule.fajr },
        { name: 'Зухр', time: schedule.dhuhr },
        { name: 'Аср', time: schedule.asr },
        { name: 'Магриб', time: schedule.maghrib },
        { name: 'Иша', time: schedule.isha },
      ];

      for (const prayer of prayers) {
        const [h, m] = prayer.time.split(':').map(Number);
        const prayerDate = new Date(now);
        prayerDate.setHours(h, m, 0, 0);

        if (prayerDate > now) {
          const diff = Math.floor((prayerDate.getTime() - now.getTime()) / 1000);
          const hours = Math.floor(diff / 3600);
          const minutes = Math.floor((diff % 3600) / 60);
          const seconds = diff % 60;

          setNextPrayer({
            name: prayer.name,
            time: prayer.time,
            remaining: `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`,
          });
          return;
        }
      }

      const [fh] = schedule.fajr.split(':').map(Number);
      const fajrTomorrow = new Date(now);
      fajrTomorrow.setDate(fajrTomorrow.getDate() + 1);
      fajrTomorrow.setHours(fh, 0, 0, 0);

      const diff = Math.floor((fajrTomorrow.getTime() - now.getTime()) / 1000);
      const hours = Math.floor(diff / 3600);
      const minutes = Math.floor((diff % 3600) / 60);
      const seconds = diff % 60;

      setNextPrayer({
        name: 'Фаджр',
        time: schedule.fajr,
        remaining: `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`,
      });
    };

    calcNextPrayer();
    const timer = setInterval(calcNextPrayer, 1000);
    return () => clearInterval(timer);
  }, [schedule]);

  useEffect(() => {
    if (galleryPhotos.length <= 3) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % galleryPhotos.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [galleryPhotos.length]);

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diff < 60) return 'только что';
    if (diff < 3600) return `${Math.floor(diff / 60)} мин назад`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} ч назад`;
    return format(date, 'dd.MM.yyyy');
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('ru-RU').format(num);
  };

  const getDonorWord = (count: number) => {
    const lastTwo = count % 100;
    const lastOne = count % 10;
    if (lastTwo >= 11 && lastTwo <= 19) return 'человек';
    if (lastOne === 1) return 'человек';
    if (lastOne >= 2 && lastOne <= 4) return 'человека';
    return 'человек';
  };

  const handleDonateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!consentGiven) {
      setWidgetError('Необходимо дать согласие на обработку персональных данных');
      return;
    }

    if (isRecurring && !showRecurringConfirm) {
      setShowRecurringConfirm(true);
      return;
    }

    setWidgetError('');
    setIsSubmitting(true);

    try {
      if (paymentMethod === 'sbp') {
        window.open('https://qr.nspk.ru/AS1A001RM6B8DC269O4R2PCTEJJRBAI0?type=01&bank=100000000111&crc=70AD', '_blank');
        return;
      }

      const res = await fetch('/api/donations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: parseFloat(isCustomMode ? customAmount : amount),
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
        setWidgetError(data.error || 'Произошла ошибка');
      }
    } catch (err) {
      setWidgetError('Проверьте подключение к интернету');
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayStats = mounted ? (stats || fallbackStats) : fallbackStats;
  const displaySchedule = schedule || fallbackSchedule;

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="px-3 md:px-6 lg:px-8 pt-4">
        <div className="relative min-h-[400px] md:min-h-[500px] lg:h-[75vh] flex items-end lg:items-center overflow-hidden rounded-[24px] lg:rounded-[32px]">
          <div className="absolute inset-0 z-0">
            <Image src="/media/Главный_план.jpg" alt="Мечеть Фатиха" fill className="object-cover object-center" priority />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10 lg:bg-gradient-to-r lg:from-black/60 lg:via-black/20 lg:to-transparent z-10" />
          </div>

        {/* Desktop: text left + widget right overlaid on photo */}
        <div className="relative z-20 w-full hidden lg:block">
          <div className="container mx-auto px-8">
            <div className="flex gap-12 items-center">
              {/* Left: text + stats */}
              <div className="flex-1 space-y-5">
                <p className="text-[#2ECC8E] text-xs font-black uppercase tracking-[0.2em]">Сбор на реконструкцию</p>
                <h1 className="font-black text-5xl xl:text-6xl text-white leading-[1.05]">Мечеть Фатиха</h1>
                <p className="text-white/70 text-base font-medium">г. Бирск, ул. Мира, 1</p>

                <div className="flex items-center gap-3">
                  <span className="bg-[#2ECC8E] text-white text-sm font-black px-4 py-1.5 rounded-full" suppressHydrationWarning>{formatNumber(Math.floor(displayStats.totalRaised))} ₽</span>
                  <span className="text-white/60 text-xs font-bold">из {formatNumber(displayStats.goal)} ₽</span>
                  <span className="text-[#2ECC8E] text-xs font-black" suppressHydrationWarning>{displayStats.progressPercent}%</span>
                </div>

                <div className="w-full max-w-lg h-2.5 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#00D5B7] to-[#00D34E] rounded-full transition-all duration-1000" style={{ width: `${Math.max(displayStats.progressPercent, 2)}%` }} />
                </div>

                <div className="flex items-center gap-8">
                  <div>
                    <div className="text-white text-xl font-black" suppressHydrationWarning>{displayStats.donorCount} {getDonorWord(displayStats.donorCount)}</div>
                    <div className="text-white/50 text-[10px] font-bold uppercase tracking-wider">Поддерживают</div>
                  </div>
                  <div className="w-px h-8 bg-white/20" />
                  <div>
                    <div className="text-white text-xl font-black" suppressHydrationWarning>{formatNumber(Math.floor(displayStats.remaining))} ₽</div>
                    <div className="text-white/50 text-[10px] font-bold uppercase tracking-wider">Осталось собрать</div>
                  </div>
                </div>

                <button onClick={() => { const url = window.location.href; const text = 'Мечеть Фатиха — сбор на реконструкцию в г. Бирске. Помогите построить мечеть!'; if (navigator.share) { navigator.share({ title: 'Мечеть Фатиха — Бирск', text, url }); } else { navigator.clipboard.writeText(`${text}\n${url}`); alert('Ссылка скопирована!'); } }} className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-full border border-white/10 hover:bg-white/20 transition-colors cursor-pointer">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M16 6l-4-4-4 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 2v13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  <span className="text-white text-xs font-black">Поделиться</span>
                </button>
              </div>

              {/* Right: widget overlaid on photo */}
              <div className="flex-none w-[420px] xl:w-[460px]" id="donation-widget">
                <div className="bg-white rounded-[28px] p-7 shadow-2xl">
                  <h2 className="text-2xl font-black text-[#1A1A1A] mb-5">Помочь сейчас</h2>
                  <div className="flex bg-[#F2F2F7] p-1 rounded-2xl mb-5">
                    <button onClick={() => setIsRecurring(false)} className={`flex-1 py-3 rounded-[14px] text-sm font-black transition-all ${!isRecurring ? 'bg-[#1C1C1E] text-white shadow-md' : 'text-[#8E8E93]'}`}>Единоразово</button>
                    <button onClick={() => setIsRecurring(true)} className={`flex-1 py-3 rounded-[14px] text-sm font-black transition-all ${isRecurring ? 'bg-[#2ECC8E] text-white shadow-md' : 'text-[#8E8E93]'}`}>Регулярно</button>
                  </div>
                  <div className="space-y-3 mb-4">
                    <input type="text" placeholder="Ваше имя" disabled={isAnonymous} className="w-full h-12 px-5 bg-white border border-[#E5E5EA] rounded-[22px] font-medium text-[#1A1A1A] focus:outline-none focus:border-[#2ECC8E] transition-all disabled:bg-[#F2F2F7] disabled:text-[#8E8E93] text-base" />
                    <button onClick={() => setIsAnonymous(!isAnonymous)} className={`w-full h-11 rounded-xl border text-sm font-bold transition-all ${isAnonymous ? 'bg-[#2ECC8E] border-[#2ECC8E] text-white' : 'border-[#E5E5EA] text-[#8E8E93] hover:border-[#C7C7CC]'}`}>{isAnonymous ? '✓ Анонимно' : 'Анонимно'}</button>
                  </div>
                  <div className="space-y-3 border-b border-[#F2F2F7] pb-4 mb-4">
                    <div className="flex items-baseline gap-2">
                      {isCustomMode ? (
                        <input type="text" inputMode="numeric" pattern="[0-9]*" value={customAmount} onChange={(e) => { const v = e.target.value.replace(/[^0-9]/g, ''); setCustomAmount(v); setAmount(v); }} autoFocus placeholder="0" className="text-4xl font-black text-[#1A1A1A] bg-transparent border-none outline-none w-40 placeholder:text-[#C7C7CC]" />
                      ) : (
                        <span className="text-4xl font-black text-[#1A1A1A]">{amount}</span>
                      )}
                      <span className="text-2xl font-black text-[#C7C7CC]">₽</span>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      {['500', '1000', '3000'].map((amt) => (
                        <button key={amt} onClick={() => { setAmount(amt); setCustomAmount(amt); setIsCustomMode(false); }} className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${!isCustomMode && amount === amt ? 'bg-[#1C1C1E] text-white' : 'bg-[#F2F2F7] text-[#8E8E93] hover:bg-[#E5E5EA]'}`}>{amt} ₽</button>
                      ))}
                      <button onClick={() => { setIsCustomMode(true); setCustomAmount(''); }} className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${isCustomMode ? 'bg-[#1C1C1E] text-white' : 'bg-[#F2F2F7] text-[#8E8E93] hover:bg-[#E5E5EA]'}`}>Своя</button>
                    </div>
                  </div>
                  <button type="button" onClick={() => setConsentGiven(!consentGiven)} className={`w-full flex items-center gap-3 p-3 rounded-2xl border-2 transition-all text-left mb-4 ${consentGiven ? 'border-[#2ECC8E] bg-[#F2FBF7]' : 'border-[#E5E5EA]'}`}>
                    <div className={`w-5 h-5 rounded-lg border-2 shrink-0 flex items-center justify-center transition-colors ${consentGiven ? 'bg-[#2ECC8E] border-[#2ECC8E]' : 'border-[#C7C7CC]'}`}>{consentGiven && <CheckCircle size={12} className="text-white" />}</div>
                    <span className="text-xs font-medium text-[#6B6B6B]">Согласие на обработку данных и <Link href="/public-offer" className="text-[#2ECC8E] font-bold hover:underline">условия оферты</Link></span>
                  </button>
                  {widgetError && <div className="p-3 bg-red-50 text-red-600 text-sm font-bold rounded-xl text-center mb-4">{widgetError}</div>}
                  <button onClick={handleDonateSubmit} disabled={isSubmitting} className="w-full h-14 bg-gradient-to-r from-[#2ECC8E] to-[#1FA870] text-white rounded-[20px] text-base font-black shadow-xl shadow-emerald-100 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 disabled:scale-100">
                    {isSubmitting ? 'Обработка...' : 'Поддержать мечеть'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile: text only */}
        <div className="relative z-20 w-full lg:hidden px-4 pb-6 pt-24">
          <div className="space-y-4">
            <p className="text-[#2ECC8E] text-[10px] font-black uppercase tracking-[0.2em]">Сбор на реконструкцию</p>
            <h1 className="font-black text-3xl text-white leading-[1.05]">Мечеть Фатиха</h1>
            <p className="text-white/70 text-sm font-medium">г. Бирск, ул. Мира, 1</p>
            <div className="flex items-center gap-2">
              <span className="bg-[#2ECC8E] text-white text-xs font-black px-3 py-1 rounded-full" suppressHydrationWarning>{formatNumber(Math.floor(displayStats.totalRaised))} ₽</span>
              <span className="text-white/60 text-[10px] font-bold">из {formatNumber(displayStats.goal)} ₽</span>
              <span className="text-[#2ECC8E] text-[10px] font-black" suppressHydrationWarning>{displayStats.progressPercent}%</span>
            </div>
            <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#00D5B7] to-[#00D34E] rounded-full transition-all duration-1000" style={{ width: `${Math.max(displayStats.progressPercent, 2)}%` }} />
            </div>
            <div className="flex items-center gap-6">
              <div>
                <div className="text-white text-lg font-black" suppressHydrationWarning>{displayStats.donorCount} {getDonorWord(displayStats.donorCount)}</div>
                <div className="text-white/50 text-[9px] font-bold uppercase tracking-wider">Поддерживают</div>
              </div>
              <div>
                <div className="text-white text-lg font-black" suppressHydrationWarning>{formatNumber(Math.floor(displayStats.remaining))} ₽</div>
                <div className="text-white/50 text-[9px] font-bold uppercase tracking-wider">Осталось</div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </section>
      <section className="lg:hidden container mx-auto px-4 -mt-4 relative z-30">
        <div id="donation-widget" className="bg-white rounded-[24px] p-5 shadow-xl">
          <h2 className="text-xl font-black text-[#1A1A1A] mb-4">Помочь сейчас</h2>
          <div className="flex bg-[#F2F2F7] p-1 rounded-2xl mb-4">
            <button onClick={() => setIsRecurring(false)} className={`flex-1 py-2.5 rounded-[14px] text-xs font-black transition-all ${!isRecurring ? 'bg-[#1C1C1E] text-white shadow-md' : 'text-[#8E8E93]'}`}>Единоразово</button>
            <button onClick={() => setIsRecurring(true)} className={`flex-1 py-2.5 rounded-[14px] text-xs font-black transition-all ${isRecurring ? 'bg-[#2ECC8E] text-white shadow-md' : 'text-[#8E8E93]'}`}>Регулярно</button>
          </div>
          <div className="space-y-3 mb-4">
            <input type="text" placeholder="Ваше имя" disabled={isAnonymous} className="w-full h-11 px-5 bg-white border border-[#E5E5EA] rounded-[22px] font-medium text-[#1A1A1A] focus:outline-none focus:border-[#2ECC8E] transition-all disabled:bg-[#F2F2F7] disabled:text-[#8E8E93] text-sm" />
            <button onClick={() => setIsAnonymous(!isAnonymous)} className={`w-full h-10 rounded-xl border text-xs font-bold transition-all ${isAnonymous ? 'bg-[#2ECC8E] border-[#2ECC8E] text-white' : 'border-[#E5E5EA] text-[#8E8E93]'}`}>{isAnonymous ? '✓ Анонимно' : 'Анонимно'}</button>
          </div>
          <div className="space-y-3 border-b border-[#F2F2F7] pb-3 mb-4">
            <div className="flex items-baseline gap-1.5">
              {isCustomMode ? (
                <input type="text" inputMode="numeric" pattern="[0-9]*" value={customAmount} onChange={(e) => { const v = e.target.value.replace(/[^0-9]/g, ''); setCustomAmount(v); setAmount(v); }} autoFocus placeholder="0" className="text-3xl font-black text-[#1A1A1A] bg-transparent border-none outline-none w-32 placeholder:text-[#C7C7CC]" />
              ) : (
                <span className="text-3xl font-black text-[#1A1A1A]">{amount}</span>
              )}
              <span className="text-xl font-black text-[#C7C7CC]">₽</span>
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {['500', '1000', '3000'].map((amt) => (
                <button key={amt} onClick={() => { setAmount(amt); setCustomAmount(amt); setIsCustomMode(false); }} className={`px-3 py-1.5 rounded-xl text-[10px] font-black transition-all ${!isCustomMode && amount === amt ? 'bg-[#1C1C1E] text-white' : 'bg-[#F2F2F7] text-[#8E8E93]'}`}>{amt} ₽</button>
              ))}
              <button onClick={() => { setIsCustomMode(true); setCustomAmount(''); }} className={`px-3 py-1.5 rounded-xl text-[10px] font-black transition-all ${isCustomMode ? 'bg-[#1C1C1E] text-white' : 'bg-[#F2F2F7] text-[#8E8E93]'}`}>Своя</button>
            </div>
          </div>
          <button type="button" onClick={() => setConsentGiven(!consentGiven)} className={`w-full flex items-center gap-3 p-3 rounded-2xl border-2 transition-all text-left mb-4 ${consentGiven ? 'border-[#2ECC8E] bg-[#F2FBF7]' : 'border-[#E5E5EA]'}`}>
            <div className={`w-5 h-5 rounded-lg border-2 shrink-0 flex items-center justify-center transition-colors ${consentGiven ? 'bg-[#2ECC8E] border-[#2ECC8E]' : 'border-[#C7C7CC]'}`}>{consentGiven && <CheckCircle size={12} className="text-white" />}</div>
            <span className="text-xs font-medium text-[#6B6B6B]">Согласие и <Link href="/public-offer" className="text-[#2ECC8E] font-bold hover:underline">условия оферты</Link></span>
          </button>
          {widgetError && <div className="p-3 bg-red-50 text-red-600 text-sm font-bold rounded-xl text-center mb-4">{widgetError}</div>}
          <button onClick={handleDonateSubmit} disabled={isSubmitting} className="w-full h-12 bg-gradient-to-r from-[#2ECC8E] to-[#1FA870] text-white rounded-[18px] text-sm font-black shadow-xl shadow-emerald-100 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 disabled:scale-100">
            {isSubmitting ? 'Обработка...' : 'Поддержать мечеть'}
          </button>
          {showRecurringConfirm && (
            <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
              <div className="bg-white p-6 rounded-2xl shadow-2xl max-w-sm w-full space-y-4">
                <h3 className="font-bold text-lg text-[#1C1C1E]">Подтверждение</h3>
                <p className="text-[#6B6B6B] text-sm">Сумма <span className="font-bold text-[#1C1C1E]">{customAmount || amount} ₽</span> будет списываться каждый месяц.</p>
                <div className="flex gap-3">
                  <button onClick={() => setShowRecurringConfirm(false)} className="flex-1 px-4 py-2.5 bg-[#F2F2F7] text-[#1C1C1E] rounded-xl font-bold text-sm hover:bg-[#E5E5EA] transition-colors">Отмена</button>
                  <button onClick={() => { setShowRecurringConfirm(false); handleDonateSubmit({ preventDefault: () => {} } as React.FormEvent); }} className="flex-1 px-4 py-2.5 bg-[#2ECC8E] text-white rounded-xl font-bold text-sm hover:bg-[#1FA870] transition-colors">Подтвердить</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* About Section */}
      <section className="bg-white py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="font-black text-2xl md:text-3xl text-[#1A1A1A] mb-5 text-center">О мечети</h2>
          <div className="space-y-3 text-[#1A1A1A] text-sm md:text-base leading-relaxed font-medium text-center md:text-left">
            <p className="text-base font-bold">Ассаляму алейкум ва рахматуллахи ва баракатух.</p>
            <p>Мечеть Фатиха в г. Бирске продолжает сбор средств для расширения и реконструкции мечети, расположенной по адресу, ул. Мира, 1.</p>
            <p>Просим вас ради довольства Аллаха, оказывать посильную материальную помощь и делится данной информацией в социальных сетях.</p>
            <div className="bg-[#F2F2F7] p-5 rounded-2xl space-y-3">
              <p className="text-2xl font-bold text-center leading-loose">يَا أَيُّهَا الَّذِينَ آمَنُوا إِن تَنصُرُوا اللَّهَ يَنصُرْكُمْ وَيُثَبِّتْ أَقْدَامَكُمْ</p>
              <p className="text-center font-bold text-sm">&quot;О те, которые уверовали! Если вы поможете Аллаху, то и Он поможет вам и утвердит ваши стопы.&quot;</p>
            </div>
            <div className="border-l-4 border-[#2ECC8E] pl-4 py-1 text-left">
              <p className="text-xs text-[#8E8E93]">Пророк Мухаммад (Да благословит его Аллах и приветствует) сказал:</p>
              <p className="text-sm font-black uppercase mt-1">«КТО ПОСТРОИТ МЕЧЕТЬ РАДИ АЛЛАХА, ТОМУ АЛЛАХ ПОСТРОИТ ДОМ В РАЮ»</p>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery - Auto-sliding carousel */}
      <section className="container mx-auto px-4 py-6">
        <h2 className="font-bold text-xl md:text-2xl text-[#1C1C1E] mb-4 text-center">Фотографии мечети</h2>
        {/* Desktop */}
        <div className="hidden md:block relative overflow-hidden rounded-xl">
          {galleryPhotos.length <= 3 ? (
            <div className="flex gap-3">
              {galleryPhotos.map((photo, i) => (
                <div key={i} className="flex-1 aspect-[16/10] relative rounded-xl overflow-hidden group cursor-pointer" onClick={() => setLightboxPhoto(photo)}>
                  <Image src={photo.src} alt={photo.alt} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="flex gap-3 transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentSlide * (100 / 3 + 1.1)}%)` }}>
                {galleryPhotos.map((photo, i) => (
                  <div key={i} className="min-w-[calc(33.333%-8px)] aspect-[16/10] relative rounded-xl overflow-hidden group cursor-pointer" onClick={() => setLightboxPhoto(photo)}>
                    <Image src={photo.src} alt={photo.alt} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                ))}
              </div>
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                {Array.from({ length: Math.ceil(galleryPhotos.length / 3) }).map((_, i) => (
                  <button key={i} onClick={() => setCurrentSlide(i * 3)} className={`w-2 h-2 rounded-full transition-all ${Math.floor(currentSlide / 3) === i ? 'bg-white w-4' : 'bg-white/50'}`} />
                ))}
              </div>
            </>
          )}
        </div>
        {/* Mobile */}
        <div className="md:hidden relative overflow-hidden rounded-xl aspect-[16/10]" onClick={() => setLightboxPhoto(galleryPhotos[currentSlide % galleryPhotos.length])}>
          {galleryPhotos.length <= 1 ? (
            <div className="w-full h-full relative">
              <Image src={galleryPhotos[0].src} alt={galleryPhotos[0].alt} fill className="object-cover" />
            </div>
          ) : (
            <>
              <div className="flex transition-transform duration-500 ease-in-out h-full" style={{ transform: `translateX(-${(currentSlide % galleryPhotos.length) * 100}%)` }}>
                {galleryPhotos.map((photo, i) => (
                  <div key={i} className="min-w-full h-full relative">
                    <Image src={photo.src} alt={photo.alt} fill className="object-cover" />
                  </div>
                ))}
              </div>
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                {galleryPhotos.map((_, i) => (
                  <button key={i} className={`w-1.5 h-1.5 rounded-full ${(currentSlide % galleryPhotos.length) === i ? 'bg-white w-4' : 'bg-white/50'}`} />
                ))}
              </div>
            </>
          )}
        </div>
        {/* Lightbox */}
        {lightboxPhoto && (
          <div className="fixed inset-0 z-[500] bg-black/90 flex items-center justify-center p-4 cursor-pointer" onClick={() => setLightboxPhoto(null)}>
            <div className="relative max-w-4xl max-h-[90vh] w-full h-full">
              <Image src={lightboxPhoto.src} alt={lightboxPhoto.alt} fill className="object-contain" />
            </div>
            <button className="absolute top-4 right-4 text-white/70 hover:text-white" onClick={() => setLightboxPhoto(null)}>
              <X size={32} />
            </button>
          </div>
        )}
      </section>

      {/* Prayer Times - Clean card with icons */}
      <section className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-[#F2F2F7]">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3 mb-5">
            <div className="text-center md:text-left">
              <h3 className="font-black text-lg text-[#1A1A1A] mb-0.5">Время намаза</h3>
              <p className="text-[#8E8E93] font-bold uppercase text-[9px] tracking-widest">{format(new Date(), 'EEEE, d MMMM', { locale: ru })}</p>
            </div>
            {nextPrayer && (
              <div className="bg-[#F2F2F7] px-4 py-2 rounded-xl text-center md:text-right">
                <div className="text-[9px] text-[#8E8E93] uppercase font-black tracking-widest mb-0.5">Следующий</div>
                <div className="font-mono text-lg font-black text-[#2ECC8E]">{nextPrayer.remaining}</div>
              </div>
            )}
          </div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
            {[
              { name: 'Фаджр', time: displaySchedule.fajr, icon: '🌅' },
              { name: 'Зухр', time: displaySchedule.dhuhr, icon: '☀️' },
              { name: 'Аср', time: displaySchedule.asr, icon: '🌤️' },
              { name: 'Магриб', time: displaySchedule.maghrib, icon: '🌅' },
              { name: 'Иша', time: displaySchedule.isha, icon: '🌙' },
              { name: 'Джума', time: displaySchedule.juma, icon: '🕌' },
            ].map((prayer, i) => (
              <div key={i} className={`p-3 rounded-xl text-center transition-all duration-300 ${nextPrayer?.name === prayer.name ? 'bg-[#2ECC8E] text-white shadow-lg shadow-emerald-100' : 'bg-[#F2F2F7] text-[#1A1A1A]'}`}>
                <div className="text-lg mb-1">{prayer.icon}</div>
                <div className={`text-[9px] uppercase font-black tracking-widest mb-1 ${nextPrayer?.name === prayer.name ? 'text-white/80' : 'text-[#8E8E93]'}`}>{prayer.name}</div>
                <div className="font-mono text-sm font-black">{prayer.time}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services - Green icon circles */}
      <section className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-end mb-4">
          <div>
            <h2 className="font-black text-xl md:text-2xl text-[#1A1A1A] mb-0.5">Услуги мечети</h2>
            <p className="text-[#8E8E93] font-bold text-xs">Наши услуги для вас</p>
          </div>
          <Link href="/help" className="text-[#2ECC8E] font-black flex items-center gap-1 uppercase text-[10px] tracking-widest">Все <ChevronRight size={12} /></Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { title: 'Джаназа', desc: 'Похоронная молитва', icon: '🤲' },
            { title: 'Никях', desc: 'Исламский брак', icon: '💍' },
            { title: 'Консультация', desc: 'С имамом', icon: '💬' },
            { title: 'Хадж/Умра', desc: 'Паломничество', icon: '🕋' },
          ].map((service, i) => (
            <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-[#F2F2F7] flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-[#2ECC8E]/10 flex items-center justify-center text-xl mb-3">
                {service.icon}
              </div>
              <h3 className="font-black text-sm text-[#1A1A1A] mb-0.5">{service.title}</h3>
              <p className="text-[#8E8E93] text-[10px] leading-snug mb-3">{service.desc}</p>
              <Link href="/help" className="w-full h-7 flex items-center justify-center bg-[#F2F2F7] text-[#1A1A1A] rounded-lg text-[9px] font-black uppercase tracking-wider hover:bg-[#2ECC8E] hover:text-white transition-all">Заявка</Link>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Donations */}
      <section className="bg-[#F2F2F7] py-8">
        <div className="container mx-auto px-4">
          <h2 className="font-black text-xl md:text-2xl text-[#1A1A1A] mb-5 text-center">Все поступления</h2>
          <div className="max-w-3xl mx-auto">
            {recentDonations.length > 0 ? (
              <div className="space-y-2 mb-5">
                {recentDonations.map((donation, i) => (
                  <div key={i} className="bg-white p-4 rounded-xl flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#F2F2F7] flex items-center justify-center text-[#1A1A1A] font-black text-sm">{donation.donorName.charAt(0)}</div>
                      <div>
                        <div className="font-black text-[#1A1A1A] text-sm">{donation.donorName}</div>
                        <div className="text-[9px] font-black uppercase tracking-widest text-[#8E8E93]">{getTimeAgo(donation.createdAt)}</div>
                      </div>
                    </div>
                    <div className="font-black text-[#2ECC8E] text-lg">{formatNumber(Math.floor(donation.amount))} ₽</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white p-8 rounded-2xl text-center shadow-sm">
                <XCircle className="mx-auto text-[#8E8E93] mb-3" size={32} />
                <p className="text-[#8E8E93] font-black uppercase text-[10px] tracking-widest">Пока нет пожертвований</p>
              </div>
            )}
            <div className="text-center">
              <button onClick={loadMoreDonations} disabled={isLoadingMore} className="bg-[#1A1A1A] text-white px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all disabled:opacity-50">
                {isLoadingMore ? <RefreshCw className="animate-spin mr-2 inline" size={14} /> : null} Загрузить ещё
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Mosque Team Section */}
      <section className="bg-white py-8">
        <div className="container mx-auto px-4">
          <h2 className="font-bold text-xl md:text-2xl text-[#1C1C1E] mb-5 text-center">Команда мечети</h2>
          <div className="grid grid-cols-2 gap-4 md:gap-6 max-w-md md:max-w-xl mx-auto">
            {[
              { name: 'имам-хатыб', image: '/media/Имам-Хатыб.jpg' },
              { name: 'имам-ахунд', image: '/media/Имам-Ахунд.jpg' },
            ].map((member, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm">
                <div className="aspect-[3/4] relative">
                  <Image src={member.image} alt={member.name} fill className="object-cover" />
                </div>
                <div className="p-4 text-center">
                  <h3 className="font-bold text-base md:text-lg text-[#1C1C1E]">{member.name}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      {events.length > 0 && (
        <section className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-end mb-4">
            <div>
              <h2 className="font-black text-xl md:text-2xl text-[#1A1A1A] mb-0.5">Ближайшие события</h2>
              <p className="text-[#8E8E93] font-bold text-xs">Мероприятия мечети</p>
            </div>
            <Link href="/events" className="text-[#2ECC8E] font-black flex items-center gap-1 uppercase text-[10px] tracking-widest">Все <ChevronRight size={12} /></Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {events.slice(0, 3).map((event: any, i: number) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[#F2F2F7] p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 bg-[#2ECC8E]/10 rounded-xl flex items-center justify-center">
                    <Calendar size={16} className="text-[#2ECC8E]" />
                  </div>
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-[#8E8E93]">{format(new Date(event.date), 'd MMMM', { locale: ru })}</div>
                    <div className="text-[10px] text-[#8E8E93] flex items-center gap-1"><Clock size={10} /> {format(new Date(event.date), 'HH:mm')}</div>
                  </div>
                </div>
                <h3 className="font-black text-sm text-[#1A1A1A] mb-1">{event.title}</h3>
                <p className="text-[#8E8E93] text-xs leading-relaxed line-clamp-2">{event.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Recurring Support */}
      <section className="container mx-auto px-4 pb-8">
        <div className="bg-[#F2F2F7] rounded-2xl p-5 md:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
            <div className="space-y-4">
              <div>
                <h2 className="font-black text-xl md:text-2xl text-[#1A1A1A] leading-tight mb-2">Станьте постоянным помощником мечети</h2>
                <p className="text-[#8E8E93] text-sm font-medium leading-relaxed">Небольшой регулярный вклад важнее редкого большого. Это позволяет нам планировать развитие и стабильно поддерживать работу мечети.</p>
              </div>
              <div className="space-y-3">
                {[
                  { icon: XCircle, text: 'Отмена в любой момент' },
                  { icon: Calendar, text: 'Ежемесячно, по пятницам или ежедневно' },
                  { icon: ShieldCheck, text: 'Безопасная оплата через проверенные системы' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-[#2ECC8E] shadow-sm shrink-0">
                      <item.icon size={16} />
                    </div>
                    <span className="font-bold text-[#1A1A1A] text-xs">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white p-5 rounded-2xl flex flex-col items-center justify-center text-center space-y-3 shadow-lg">
              <div className="w-12 h-12 bg-[#F2FBF7] rounded-full flex items-center justify-center text-[#2ECC8E]">
                <Heart size={24} className="fill-current" />
              </div>
              <div>
                <h3 className="font-black text-base text-[#1A1A1A] mb-0.5">Подключить подписку</h3>
                <p className="text-[#8E8E93] font-medium text-xs">Выберите удобную сумму и период</p>
              </div>
              <button onClick={() => { setIsRecurring(true); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="w-full bg-[#1A1A1A] text-white py-3 rounded-xl font-black text-[10px] uppercase tracking-[0.15em] hover:bg-[#2ECC8E] transition-all">
                Оформить подписку
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
