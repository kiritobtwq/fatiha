'use client';

import { useState, useEffect } from 'react';
import { RefreshCw, AlertTriangle } from 'lucide-react';

export default function StylesLoader() {
  const [loaded, setLoaded] = useState(true);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      const body = document.body;
      const styles = window.getComputedStyle(body);
      const fontFamily = styles.fontFamily;

      if (!fontFamily.includes('Nunito') && !fontFamily.includes('sans-serif')) {
        setLoaded(false);
      }
      setChecking(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (checking || loaded) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-white flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto">
          <AlertTriangle className="text-amber-600" size={32} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Проблема с загрузкой</h2>
          <p className="text-slate-500">
            Стили не загрузились. Попробуйте обновить страницу.
          </p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary-dark transition-colors"
        >
          <RefreshCw size={18} />
          Обновить страницу
        </button>
        <p className="text-xs text-slate-400">
          Если проблема повторяется — очистите кеш браузера (Ctrl+Shift+Delete)
        </p>
      </div>
    </div>
  );
}
