import Link from 'next/link';
import { XCircle } from 'lucide-react';

export default function CancelPage() {
  return (
    <div className="py-20 min-h-screen flex items-center justify-center">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto text-center">
          <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-8">
            <XCircle className="text-red-600" size={64} />
          </div>
          <h1 className="font-display font-extrabold text-4xl md:text-5xl text-text-primary mb-6">
            Оплата отменена
          </h1>
          <p className="text-text-secondary text-xl font-medium mb-12">
            Если у вас возникли вопросы — напишите нам
          </p>
          <div className="space-y-4">
            <Link href="/support" className="btn-primary w-full justify-center text-lg">
              Попробовать ещё раз
            </Link>
            <Link href="/" className="btn-secondary w-full justify-center">
              На главную
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
