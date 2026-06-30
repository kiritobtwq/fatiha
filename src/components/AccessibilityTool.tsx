'use client';

import { useState, useEffect } from 'react';
import { Eye, Type, Contrast, RotateCcw, X } from 'lucide-react';

export default function AccessibilityTool() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLargeFont, setIsLargeFont] = useState(false);
  const [isHighContrast, setIsHighContrast] = useState(false);

  useEffect(() => {
    document.documentElement.style.fontSize = isLargeFont ? '130%' : '100%';
    if (isHighContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  }, [isLargeFont, isHighContrast]);

  const reset = () => {
    setIsLargeFont(false);
    setIsHighContrast(false);
  };

  return (
    <div className="fixed bottom-10 left-10 z-[300]">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 text-white rounded-full flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-4"
        style={{ backgroundColor: 'var(--color-primary)', boxShadow: '0 4px 14px rgba(26, 157, 108, 0.3)' }}
        title="Версия для слабовидящих"
      >
        <Eye size={24} />
      </button>

      {/* Menu */}
      {isOpen && (
        <div className="absolute bottom-16 left-0 w-72 rounded-2xl p-5 space-y-5" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', boxShadow: '0 20px 50px rgba(0, 0, 0, 0.12)' }}>
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm" style={{ color: 'var(--color-text)' }}>Доступность</h3>
            <button onClick={() => setIsOpen(false)} className="p-1 rounded-lg transition-colors" style={{ color: 'var(--color-text-muted)' }}>
              <X size={18} />
            </button>
          </div>

          {/* Font Size Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>
              <Type size={16} /> Размер шрифта
            </div>
            <button
              onClick={() => setIsLargeFont(!isLargeFont)}
              className="px-3 py-1.5 text-xs font-bold rounded-lg transition-colors"
              style={{
                backgroundColor: isLargeFont ? 'var(--color-primary)' : '#e5e7eb',
                color: isLargeFont ? 'white' : '#374151',
              }}
            >
              {isLargeFont ? 'Вкл' : 'Выкл'}
            </button>
          </div>

          {/* High Contrast */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>
              <Contrast size={16} /> Высокий контраст
            </div>
            <button
              onClick={() => setIsHighContrast(!isHighContrast)}
              className="px-3 py-1.5 text-xs font-bold rounded-lg transition-colors"
              style={{
                backgroundColor: isHighContrast ? 'var(--color-primary)' : '#e5e7eb',
                color: isHighContrast ? 'white' : '#374151',
              }}
            >
              {isHighContrast ? 'Вкл' : 'Выкл'}
            </button>
          </div>

          {/* Reset */}
          <button
            onClick={reset}
            className="w-full py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition-colors duration-200"
            style={{ backgroundColor: '#f3f4f6', color: 'var(--color-text-secondary)' }}
          >
            <RotateCcw size={14} /> Сбросить настройки
          </button>
        </div>
      )}

      <style jsx global>{`
        .high-contrast {
          filter: contrast(1.3) saturate(1.3);
        }
        .high-contrast body {
          background-color: #fff !important;
          color: #000 !important;
        }
        .high-contrast .card-container, 
        .high-contrast .bg-white,
        .high-contrast section {
          border: 2px solid #000 !important;
        }
        .high-contrast p, 
        .high-contrast span, 
        .high-contrast div {
          color: #000 !important;
        }
        .high-contrast .text-white {
          color: #fff !important;
        }
        .high-contrast .text-white\/70,
        .high-contrast .text-white\/80,
        .high-contrast .text-white\/50,
        .high-contrast .text-white\/60 {
          color: #fff !important;
        }
        .high-contrast .btn-primary {
          background-color: #000 !important;
          color: #fff !important;
          border: 2px solid #000 !important;
        }
        .high-contrast a {
          color: #000 !important;
          text-decoration: underline !important;
        }
        .high-contrast img {
          filter: contrast(1.1) !important;
        }
        .high-contrast .bg-\\[\\#2ECC8E\\] {
          background-color: #000 !important;
          color: #fff !important;
        }
        .high-contrast input, .high-contrast textarea {
          border: 2px solid #000 !important;
          background-color: #fff !important;
          color: #000 !important;
        }
      `}</style>
    </div>
  );
}
