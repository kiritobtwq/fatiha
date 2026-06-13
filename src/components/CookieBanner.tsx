'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasAccepted = localStorage.getItem('cookieAccepted');
    if (!hasAccepted) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieAccepted', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#1C1C1E] text-white p-4 z-[400] shadow-2xl">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex-1 text-sm">
            <p className="font-bold mb-1">Мы используем файлы cookie</p>
            <p className="text-[#8E8E93]">
              Мы используем cookie для улучшения работы сайта и анализа трафика. Продолжая использовать сайт, вы соглашаетесь с нашей политикой использования файлов cookie.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleAccept}
              className="px-6 py-2 bg-[#2ECC8E] text-white rounded-xl font-bold text-sm hover:bg-[#27AE60] transition-colors whitespace-nowrap"
            >
              Принять
            </button>
            <button
              onClick={() => setIsVisible(false)}
              className="p-2 text-[#8E8E93] hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
