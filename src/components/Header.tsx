'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Heart, Menu, X } from 'lucide-react';

interface HeaderProps {
  mosqueName: string;
}

export default function Header({ mosqueName }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMenu = () => setIsMobileMenuOpen(false);

  const handleSupportClick = () => {
    closeMenu();
    if (isHome) {
      const widget = document.getElementById('donation-widget');
      if (widget) {
        const rect = widget.getBoundingClientRect();
        const offset = rect.top + window.scrollY - 100;
        window.scrollTo({ top: Math.max(0, offset), behavior: 'smooth' });
        setTimeout(() => {
          const nameInput = widget.querySelector('input[placeholder="Ваше имя"]') as HTMLInputElement;
          if (nameInput) nameInput.focus();
        }, 600);
      }
    } else {
      window.location.href = '/#donation-widget';
    }
  };

  const headerStyle = isHome
    ? {
        backgroundColor: isScrolled ? 'rgba(255, 255, 255, 0.92)' : 'transparent',
        backdropFilter: isScrolled ? 'blur(20px)' : 'none',
        WebkitBackdropFilter: isScrolled ? 'blur(20px)' : 'none',
        borderBottom: isScrolled ? '1px solid rgba(0, 0, 0, 0.06)' : '1px solid transparent',
        boxShadow: isScrolled ? '0 4px 30px rgba(0, 0, 0, 0.06)' : 'none',
      }
    : {
        backgroundColor: 'rgba(255, 255, 255, 0.92)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.06)',
      };

  const isWhite = isHome ? isScrolled : true;

  return (
    <header
      className="fixed top-0 left-0 right-0 h-20 z-[100]"
      style={{ ...headerStyle, transition: 'box-shadow 0.3s ease, border-color 0.3s ease' }}
    >
      <div className="container mx-auto px-4 h-full flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 shrink-0 group">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-105"
            style={{ backgroundColor: isWhite ? 'var(--color-primary)' : 'rgba(255,255,255,0.15)' }}
          >
            <Image
              src="/logo-small.webp"
              alt={mosqueName}
              width={28}
              height={28}
              className="object-contain"
            />
          </div>
          <span
            className="font-bold text-xl md:text-2xl transition-colors duration-300"
            style={{
              fontFamily: 'var(--font-playfair)',
              color: isWhite ? 'var(--color-text)' : 'white',
            }}
          >
            {mosqueName}
          </span>
        </Link>

        <nav className="hidden min-[1000px]:flex items-center gap-1 ml-auto mr-4">
          {[
            { href: '/about', label: 'О нас' },
            { href: '/help', label: 'Чем поможем' },
            { href: '/schedule', label: 'Расписание' },
            { href: '/education', label: 'Обучение' },
            { href: '/supporters', label: 'Жертвователи' },
            { href: '/contact', label: 'Связаться' },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-3 py-2 text-sm font-semibold rounded-lg transition-all duration-200"
              style={{
                color: isWhite ? 'var(--color-text-secondary)' : 'rgba(255,255,255,0.7)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = isWhite ? 'var(--color-primary)' : 'white';
                e.currentTarget.style.backgroundColor = isWhite ? 'var(--color-primary-light)' : 'rgba(255,255,255,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = isWhite ? 'var(--color-text-secondary)' : 'rgba(255,255,255,0.7)';
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            aria-label="Поддержать мечеть"
            onClick={handleSupportClick}
            className="hidden min-[1000px]:flex btn-primary !py-2.5 !px-5 text-sm transition-all duration-300"
            style={{
              backgroundColor: isWhite ? 'var(--color-primary)' : 'rgba(255,255,255,0.15)',
              border: isWhite ? 'none' : '1px solid rgba(255,255,255,0.2)',
              boxShadow: isWhite ? '0 4px 20px rgba(13, 124, 95, 0.3)' : 'none',
            }}
          >
            <Heart size={15} className="fill-current" />
            Поддержать
          </button>
          <button
            aria-label={isMobileMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="min-[1000px]:hidden p-2 rounded-lg transition-all duration-200"
            style={{ color: isWhite ? 'var(--color-text-secondary)' : 'rgba(255,255,255,0.8)' }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = isWhite ? 'var(--color-primary-light)' : 'rgba(255,255,255,0.1)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div
          className="min-[1000px]:hidden absolute top-full left-0 right-0"
          style={{
            backgroundColor: isWhite ? 'rgba(255, 255, 255, 0.98)' : 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderBottom: isWhite ? '1px solid rgba(0, 0, 0, 0.06)' : '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: isWhite ? '0 12px 40px rgba(0, 0, 0, 0.1)' : 'none',
          }}
        >
          <nav className="flex flex-col p-4 gap-1">
            {[
              { href: '/about', label: 'О нас' },
              { href: '/help', label: 'Чем поможем' },
              { href: '/schedule', label: 'Расписание' },
              { href: '/education', label: 'Обучение' },
              { href: '/supporters', label: 'Жертвователи' },
              { href: '/contact', label: 'Связаться' },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMenu}
                className="px-4 py-3 text-sm font-semibold rounded-xl transition-colors duration-200"
                style={{ color: isWhite ? 'var(--color-text-secondary)' : 'rgba(255,255,255,0.9)' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-primary)'; e.currentTarget.style.backgroundColor = isWhite ? 'var(--color-primary-light)' : 'rgba(255,255,255,0.1)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = isWhite ? 'var(--color-text-secondary)' : 'rgba(255,255,255,0.9)'; e.currentTarget.style.backgroundColor = 'transparent'; }}
              >
                {item.label}
              </Link>
            ))}
            <button aria-label="Поддержать мечеть" onClick={handleSupportClick} className="btn-primary !py-3 !px-6 text-sm w-full mt-2">
              <Heart size={15} className="fill-current" />
              Поддержать
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
