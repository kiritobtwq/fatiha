'use client';

import Link from 'next/link';
import { config } from '@/config';

export default function Footer() {
  return (
    <footer className="dark-section py-16 md:py-20 relative overflow-hidden">
      <div className="absolute inset-0 islamic-pattern opacity-[0.02]" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg text-white bg-[var(--color-primary)]">
                А
              </div>
              <span className="font-bold text-xl text-white" style={{ fontFamily: 'var(--font-playfair)' }}>Фатиха</span>
            </Link>
            <p className="text-sm leading-relaxed text-white/50">
              Место молитвы, знания и общения для мусульман города {config.mosque.city}. Мы строим будущее вместе.
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-sm uppercase tracking-wider text-white/30">Навигация</h4>
            <ul className="space-y-3">
              {[
                { href: '/about', label: 'О нас' },
                { href: '/help', label: 'Чем поможем' },
                { href: '/schedule', label: 'Расписание' },
                { href: '/education', label: 'Обучение' },
                { href: '/', label: 'Поддержать' },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm font-medium transition-colors duration-200 text-white/60 hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-sm uppercase tracking-wider text-white/30">Услуги</h4>
            <ul className="space-y-3">
              {[
                { href: '/contact?topic=Джаназа (похоронная молитва)', label: 'Джаназа' },
                { href: '/contact?topic=Никях (исламский брак)', label: 'Никях' },
                { href: '/contact?topic=Консультация имама', label: 'Консультация имама' },
                { href: '/contact?topic=Уроки для паломников', label: 'Уроки Хаджа' },
              ].map((item, i) => (
                <li key={i}>
                  <Link
                    href={item.href}
                    className="text-sm font-medium transition-colors duration-200 text-white/60 hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-sm uppercase tracking-wider text-white/30">Контакты</h4>
            <div className="space-y-4">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-widest mb-1 text-white/30">Адрес</span>
                <p className="text-sm font-medium text-white/70">{config.mosque.address}</p>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-widest mb-1 text-white/30">Телефон</span>
                <p className="text-sm font-medium text-white/70">{config.mosque.phone}</p>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-widest mb-1 text-white/30">Email</span>
                <p className="text-sm font-medium text-white/70">{config.mosque.email}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs border-t border-white/5">
          <span className="text-white/30">&copy; {new Date().getFullYear()} Мечеть Фатиха. Все права защищены.</span>
          <div className="flex gap-6">
            <Link
              href="/privacy-policy"
              className="font-medium transition-colors duration-200 text-white/40 hover:text-white"
            >
              Политика конфиденциальности
            </Link>
            <Link
              href="/public-offer"
              className="font-medium transition-colors duration-200 text-white/40 hover:text-white"
            >
              Публичная оферта
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
