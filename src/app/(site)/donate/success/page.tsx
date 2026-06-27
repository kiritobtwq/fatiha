'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { CheckCircle } from 'lucide-react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const donationId = searchParams.get('donationId');

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-8">
      <div className="text-center space-y-6 max-w-md">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto">
          <CheckCircle size={40} className="text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-slate-800">Спасибо за поддержку!</h1>
        <p className="text-slate-500 leading-relaxed">
          Ваше пожертвование успешно оформлено. Мечеть Фатиха благодарит вас за помощь.
        </p>
        {donationId && (
          <p className="text-xs text-slate-400">Номер заявки: #{donationId}</p>
        )}
        <div className="flex gap-3 justify-center pt-4">
          <Link
            href="/"
            className="px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary-dark transition-colors"
          >
            На главную
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function DonateSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-[60vh] flex items-center justify-center"><p className="text-slate-400">Загрузка...</p></div>}>
      <SuccessContent />
    </Suspense>
  );
}
