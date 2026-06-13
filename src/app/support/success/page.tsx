import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

export default function SuccessPage() {
  return (
    <div className="py-20 min-h-screen flex items-center justify-center">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto text-center">
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle className="text-primary" size={64} />
          </div>
          <h1 className="font-display font-extrabold text-4xl md:text-5xl text-text-primary mb-6">
            Спасибо за поддержку!
          </h1>
          <p className="text-text-secondary text-xl font-medium mb-12">
            Ваше пожертвование зачислено. Вы помогаете развивать мечеть
          </p>
          <div className="space-y-4">
            <Link href="/" className="btn-primary w-full justify-center text-lg">
              На главную
            </Link>
            <Link href="/support" className="btn-secondary w-full justify-center">
              Поддержать ещё раз
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
