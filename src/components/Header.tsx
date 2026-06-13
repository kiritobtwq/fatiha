'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Heart, Menu, X } from 'lucide-react';
import DonationModal from '@/components/DonationModal';

interface HeaderProps {
  mosqueName: string;
}

export default function Header({ mosqueName }: HeaderProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const closeMenu = () => setIsMobileMenuOpen(false);

  const handleSupportClick = () => {
    closeMenu();
    const widget = document.getElementById('donation-widget');
    if (widget) {
      const rect = widget.getBoundingClientRect();
      const offset = rect.top + window.scrollY - 100;
      window.scrollTo({ top: offset, behavior: 'smooth' });
    } else {
      setIsModalOpen(true);
    }
  };

  return (
    <>
      <DonationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      <header className="fixed top-0 left-0 right-0 h-[72px] bg-white/90 backdrop-blur-md border-b border-border z-[100]">
        <div className="container mx-auto px-4 h-full flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border-2 border-primary flex items-center justify-center font-display font-extrabold text-2xl text-primary">
              {mosqueName[0]}
            </div>
            <span className="font-display font-bold text-xl md:text-2xl text-[#1C1C1E]">{mosqueName}</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            <Link href="/about" className="text-sm font-bold text-slate-600 hover:text-primary transition-colors">О нас</Link>
            <Link href="/help" className="text-sm font-bold text-slate-600 hover:text-primary transition-colors">Чем поможем</Link>
            <Link href="/schedule" className="text-sm font-bold text-slate-600 hover:text-primary transition-colors">Расписание</Link>
            <Link href="/education" className="text-sm font-bold text-slate-600 hover:text-primary transition-colors">Обучение</Link>
            <Link href="/supporters" className="text-sm font-bold text-slate-600 hover:text-primary transition-colors">Жертвователи</Link>
            <Link href="/contact" className="text-sm font-bold text-slate-600 hover:text-primary transition-colors">Связаться</Link>
          </nav>

          <div className="flex items-center gap-2">
            <button 
              onClick={handleSupportClick}
              className="hidden md:flex btn-primary !py-2.5 !px-6 text-sm shadow-lg shadow-primary/20"
            >
              <Heart size={16} className="fill-current" />
              Поддержать
            </button>

            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-primary"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-border shadow-lg">
            <nav className="flex flex-col p-4 space-y-4">
              <Link href="/about" onClick={closeMenu} className="text-sm font-bold text-slate-600 hover:text-primary transition-colors py-2">О нас</Link>
              <Link href="/help" onClick={closeMenu} className="text-sm font-bold text-slate-600 hover:text-primary transition-colors py-2">Чем поможем</Link>
              <Link href="/schedule" onClick={closeMenu} className="text-sm font-bold text-slate-600 hover:text-primary transition-colors py-2">Расписание</Link>
              <Link href="/education" onClick={closeMenu} className="text-sm font-bold text-slate-600 hover:text-primary transition-colors py-2">Обучение</Link>
              <Link href="/supporters" onClick={closeMenu} className="text-sm font-bold text-slate-600 hover:text-primary transition-colors py-2">Жертвователи</Link>
              <Link href="/contact" onClick={closeMenu} className="text-sm font-bold text-slate-600 hover:text-primary transition-colors py-2">Связаться</Link>
              <button 
                onClick={() => { handleSupportClick(); closeMenu(); }}
                className="btn-primary !py-3 !px-6 text-sm shadow-lg shadow-primary/20 w-full"
              >
                <Heart size={16} className="fill-current" />
                Поддержать
              </button>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
