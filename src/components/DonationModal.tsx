'use client';

import { useState } from 'react';
import Link from 'next/link';
import { X, CheckCircle, QrCodeIcon } from 'lucide-react';

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DonationModal({ isOpen, onClose }: DonationModalProps) {
  const [isRecurring, setIsRecurring] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [amount, setAmount] = useState('500');
  const [customAmount, setCustomAmount] = useState('');
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [consentGiven, setConsentGiven] = useState(false);

  if (!isOpen) return null;

  const handleDonateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!consentGiven) {
      setError('Дайте согласие на обработку данных');
      return;
    }

    const finalAmount = isCustomMode ? customAmount : amount;
    if (!finalAmount || parseFloat(finalAmount) <= 0) {
      setError('Введите сумму пожертвования');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/donations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: parseFloat(finalAmount),
          donorName: isAnonymous ? 'Аноним' : 'Брат/Сестра',
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

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-md" onClick={onClose} />

      <div className="relative bg-white w-full max-w-md rounded-[24px] shadow-2xl p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black text-[#1A1A1A]">Помочь сейчас</h2>
          <button onClick={onClose} className="p-2 hover:bg-[#F2F2F7] rounded-full transition-colors">
            <X size={20} className="text-[#8E8E93]" />
          </button>
        </div>

        <div className="flex bg-[#F2F2F7] p-1 rounded-2xl">
          <button onClick={() => setIsRecurring(false)} className={`flex-1 py-2.5 rounded-[14px] text-xs font-black transition-all ${!isRecurring ? 'bg-[#1C1C1E] text-white shadow-md' : 'text-[#8E8E93]'}`}>Единоразово</button>
          <button onClick={() => setIsRecurring(true)} className={`flex-1 py-2.5 rounded-[14px] text-xs font-black transition-all ${isRecurring ? 'bg-[#2ECC8E] text-white shadow-md' : 'text-[#8E8E93]'}`}>Регулярно</button>
        </div>

        <div className="space-y-3">
          <input type="text" placeholder="Ваше имя" disabled={isAnonymous} className="w-full h-11 px-5 bg-white border border-[#E5E5EA] rounded-[22px] font-medium text-[#1A1A1A] focus:outline-none focus:border-[#2ECC8E] transition-all disabled:bg-[#F2F2F7] disabled:text-[#8E8E93] text-sm" />
          <button onClick={() => setIsAnonymous(!isAnonymous)} className={`w-full h-10 rounded-xl border text-xs font-bold transition-all ${isAnonymous ? 'bg-[#2ECC8E] border-[#2ECC8E] text-white' : 'border-[#E5E5EA] text-[#8E8E93] hover:border-[#C7C7CC]'}`}>{isAnonymous ? '✓ Анонимно' : 'Анонимно'}</button>
        </div>

        <div className="space-y-3 border-b border-[#F2F2F7] pb-3">
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
              <button key={amt} onClick={() => { setAmount(amt); setCustomAmount(amt); setIsCustomMode(false); }} className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase transition-all ${!isCustomMode && amount === amt ? 'bg-[#1C1C1E] text-white' : 'bg-[#F2F2F7] text-[#8E8E93] hover:bg-[#E5E5EA]'}`}>{amt} ₽</button>
            ))}
            <button onClick={() => { setIsCustomMode(true); setCustomAmount(''); }} className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase transition-all ${isCustomMode ? 'bg-[#1C1C1E] text-white' : 'bg-[#F2F2F7] text-[#8E8E93] hover:bg-[#E5E5EA]'}`}>Своя</button>
          </div>
        </div>

        <button type="button" onClick={() => setConsentGiven(!consentGiven)} className={`w-full flex items-center gap-3 p-3 rounded-2xl border-2 transition-all text-left ${consentGiven ? 'border-[#2ECC8E] bg-[#F2FBF7]' : 'border-[#E5E5EA] hover:border-[#C7C7CC]'}`}>
          <div className={`w-5 h-5 rounded-lg border-2 shrink-0 flex items-center justify-center transition-colors ${consentGiven ? 'bg-[#2ECC8E] border-[#2ECC8E]' : 'border-[#C7C7CC]'}`}>
            {consentGiven && <CheckCircle size={12} className="text-white" />}
          </div>
          <span className="text-xs font-medium text-[#6B6B6B]">Согласие на обработку данных и <Link href="/public-offer" className="text-[#2ECC8E] font-bold hover:underline" onClick={(e) => e.stopPropagation()}>условия оферты</Link></span>
        </button>

        {error && <div className="p-3 bg-red-50 text-red-600 text-sm font-bold rounded-xl text-center">{error}</div>}

        <button onClick={handleDonateSubmit} disabled={isSubmitting} className="w-full h-12 bg-gradient-to-r from-[#2ECC8E] to-[#1FA870] text-white rounded-[18px] text-sm font-black shadow-xl shadow-emerald-100 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 disabled:scale-100">
          {isSubmitting ? 'Обработка...' : 'Поддержать мечеть'}
        </button>
      </div>
    </div>
  );
}
