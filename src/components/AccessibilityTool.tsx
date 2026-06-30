'use client';

import { useState, useEffect } from 'react';
import { Eye } from 'lucide-react';

export default function AccessibilityTool() {
  const [isLargeFont, setIsLargeFont] = useState(false);

  useEffect(() => {
    document.documentElement.style.fontSize = isLargeFont ? '130%' : '100%';
  }, [isLargeFont]);

  return (
    <button
      onClick={() => setIsLargeFont(!isLargeFont)}
      className="fixed bottom-10 left-10 z-[300] w-14 h-14 text-white rounded-full flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-4"
      style={{
        backgroundColor: isLargeFont ? 'var(--color-primary)' : 'rgba(13, 124, 95, 0.55)',
        boxShadow: isLargeFont ? '0 0 0 3px white, 0 4px 14px rgba(26, 157, 108, 0.4)' : '0 4px 14px rgba(26, 157, 108, 0.3)',
      }}
      title={isLargeFont ? 'Обычный размер шрифта' : 'Крупный размер шрифта'}
    >
      <Eye size={24} />
      {isLargeFont && <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-white rounded-full border-2" style={{ borderColor: 'var(--color-primary)' }} />}
    </button>
  );
}
