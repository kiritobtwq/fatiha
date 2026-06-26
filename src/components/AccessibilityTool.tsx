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
    <div className="fixed bottom-6 left-6 z-[300]">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-primary text-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform focus:outline-none focus:ring-4 focus:ring-primary/20"
        title="Версия для слабовидящих"
      >
        <Eye size={32} />
      </button>

      {/* Menu */}
      {isOpen && (
        <div className="absolute bottom-16 left-0 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-6 animate-in slide-in-from-bottom-4 fade-in duration-200">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-800">Доступность</h3>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600">
              <X size={20} />
            </button>
          </div>

          {/* Font Size Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-500">
              <Type size={16} /> Размер шрифта
            </div>
            <button
              onClick={() => setIsLargeFont(!isLargeFont)}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                isLargeFont ? 'bg-primary' : 'bg-slate-200'
              }`}
            >
              <div
                className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  isLargeFont ? 'left-7' : 'left-1'
                }`}
              />
            </button>
          </div>

          {/* High Contrast */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-500">
              <Contrast size={16} /> Высокий контраст
            </div>
            <button
              onClick={() => setIsHighContrast(!isHighContrast)}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                isHighContrast ? 'bg-primary' : 'bg-slate-200'
              }`}
            >
              <div
                className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  isHighContrast ? 'left-7' : 'left-1'
                }`}
              />
            </button>
          </div>

          {/* Reset */}
          <button
            onClick={reset}
            className="w-full py-2 bg-slate-50 text-slate-500 text-xs font-bold rounded-lg flex items-center justify-center gap-2 hover:bg-slate-100 transition-colors"
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
