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

      <div className="relative w-full max-w-md rounded-3xl p-6 space-y-5" style={{ backgroundColor: 'var(--color-surface)', boxShadow: '0 25px 60px rgba(0, 0, 0, 0.15)' }}>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold" style={{ color: 'var(--color-text)', fontFamily: 'var(--font-playfair)' }}>Помочь сейчас</h2>
          <button onClick={onClose} className="p-2 rounded-xl transition-colors" style={{ color: 'var(--color-text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        <div className="flex p-1 rounded-xl" style={{ backgroundColor: '#f3f4f6' }}>
          <button onClick={() => setIsRecurring(false)} className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all duration-200 ${!isRecurring ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400'}`}>Единоразово</button>
          <button onClick={() => setIsRecurring(true)} className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all duration-200 ${isRecurring ? 'text-white shadow-sm' : 'text-gray-400'}`} style={isRecurring ? { backgroundColor: 'var(--color-primary)' } : {}}>Регулярно</button>
        </div>

        <div className="space-y-3">
          <input type="text" placeholder="Ваше имя" disabled={isAnonymous} className="w-full h-10 px-4 bg-white rounded-xl font-medium text-sm transition-all duration-200 disabled:opacity-50" style={{ border: '1.5px solid #e5e7eb', color: 'var(--color-text)' }} onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--color-primary)'; }} onBlur={(e) => { e.currentTarget.style.borderColor = '#e5e7eb'; }} />
          <button onClick={() => setIsAnonymous(!isAnonymous)} className="w-full h-9 rounded-lg border text-xs font-bold transition-all duration-200" style={isAnonymous ? { backgroundColor: 'var(--color-primary)', borderColor: 'var(--color-primary)', color: 'white' } : { borderColor: '#e5e7eb', color: '#9ca3af' }}>{isAnonymous ? '✓ Анонимно' : 'Анонимно'}</button>
        </div>

        <div className="space-y-3 pb-3" style={{ borderBottom: '1px solid #f3f4f6' }}>
          <div className="flex items-baseline gap-1.5">
            {isCustomMode ? (
              <input type="text" inputMode="numeric" pattern="[0-9]*" value={customAmount} onChange={(e) => { const v = e.target.value.replace(/[^0-9]/g, ''); setCustomAmount(v); setAmount(v); }} autoFocus placeholder="0" className="text-2xl font-bold bg-transparent border-none outline-none w-28" style={{ color: 'var(--color-text)' }} />
            ) : (
              <span className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>{amount}</span>
            )}
            <span className="text-lg" style={{ color: '#d1d5db' }}>₽</span>
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {['500', '1000', '3000'].map((amt) => (
              <button key={amt} onClick={() => { setAmount(amt); setCustomAmount(amt); setIsCustomMode(false); }} className="px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all duration-200" style={!isCustomMode && amount === amt ? { backgroundColor: 'var(--color-text)', color: 'white' } : { backgroundColor: '#f3f4f6', color: '#9ca3af' }}>{amt} ₽</button>
            ))}
            <button onClick={() => { setIsCustomMode(true); setCustomAmount(''); }} className="px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all duration-200" style={isCustomMode ? { backgroundColor: 'var(--color-text)', color: 'white' } : { backgroundColor: '#f3f4f6', color: '#9ca3af' }}>Своя</button>
          </div>
        </div>

        <button type="button" onClick={() => setConsentGiven(!consentGiven)} className="w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 text-left" style={consentGiven ? { border: '1.5px solid var(--color-primary)', backgroundColor: 'rgba(26, 157, 108, 0.05)' } : { border: '1.5px solid #e5e7eb' }}>
          <div className="w-5 h-5 rounded-md shrink-0 flex items-center justify-center transition-all duration-200" style={consentGiven ? { backgroundColor: 'var(--color-primary)', border: '1.5px solid var(--color-primary)' } : { border: '1.5px solid #d1d5db' }}>
            {consentGiven && <CheckCircle size={12} className="text-white" />}
          </div>
          <span className="text-xs font-medium" style={{ color: '#6b7280' }}>Согласие на обработку данных и <Link href="/public-offer" className="font-bold hover:underline" style={{ color: 'var(--color-primary)' }} onClick={(e) => e.stopPropagation()}>условия оферты</Link></span>
        </button>

        {error && <div className="p-3 text-sm font-bold rounded-xl text-center" style={{ backgroundColor: '#fef2f2', color: '#dc2626' }}>{error}</div>}

        <button onClick={handleDonateSubmit} disabled={isSubmitting} className="w-full h-11 text-white rounded-xl text-sm font-bold transition-all duration-200 disabled:opacity-50" style={{ backgroundColor: 'var(--color-primary)', boxShadow: '0 4px 14px rgba(26, 157, 108, 0.3)' }}>
          {isSubmitting ? 'Обработка...' : 'Поддержать мечеть'}
        </button>
      </div>
    </div>
  );
}
