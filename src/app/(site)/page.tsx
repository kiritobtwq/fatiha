'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import {
  Users,
  CheckCircle,
  ArrowRight,
  ChevronRight,
  XCircle,
  X,
  ShieldCheck,
  RefreshCw,
  Calendar,
  Heart,
  Clock,
} from 'lucide-react';

interface PrayerSchedule {
  fajr: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  juma: string;
}

interface Donation {
  id: number;
  amount: number;
  donorName: string;
  status: string;
  createdAt: string;
}

interface Stats {
  totalRaised: number;
  donorCount: number;
  remaining: number;
  goal: number;
  progressPercent: number;
}

function AnimatedSection({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94], delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function AnimatedCounter({ value, suffix = '', prefix = '' }: { value: number; suffix?: string; prefix?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [isInView, value]);

  return (
    <span ref={ref} suppressHydrationWarning>
      {prefix}{new Intl.NumberFormat('ru-RU').format(displayValue)}{suffix}
    </span>
  );
}

function IslamicPatternDivider({ dark = false }: { dark?: boolean }) {
  return (
    <div className={`section-divider ${dark ? 'section-divider-dark' : ''}`} />
  );
}

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [schedule, setSchedule] = useState<PrayerSchedule | null>(null);
  const [nextPrayer, setNextPrayer] = useState<{ name: string; time: string; remaining: string } | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentDonations, setRecentDonations] = useState<Donation[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [donationLimit, setDonationLimit] = useState(8);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [donateAmount, setDonateAmount] = useState('1000');
  const [showAllEvents, setShowAllEvents] = useState(false);
  const [lightboxPhoto, setLightboxPhoto] = useState<{ src: string; alt: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [widgetError, setWidgetError] = useState('');
  const [consentGiven, setConsentGiven] = useState(false);
  const [isRecurring, setIsRecurring] = useState(false);
  const [phone, setPhone] = useState('+7');
  const [phoneError, setPhoneError] = useState('');

  const [currentSlide, setCurrentSlide] = useState(0);
  const [galleryPhotos, setGalleryPhotos] = useState<{ src: string; alt: string }[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const isDragging = useRef(false);
  const dragStartX = useRef(0);

  const heroRef = useRef(null);

  const aboutRef = useRef(null);
  const aboutInView = useInView(aboutRef, { once: true, margin: '-100px' });

  const prayerRef = useRef(null);
  const prayerInView = useInView(prayerRef, { once: true, margin: '-100px' });

  const galleryRef = useRef(null);
  const galleryInView = useInView(galleryRef, { once: true, margin: '-100px' });

  const servicesRef = useRef(null);
  const servicesInView = useInView(servicesRef, { once: true, margin: '-100px' });

  const donationsRef = useRef(null);
  const donationsInView = useInView(donationsRef, { once: true, margin: '-100px' });

  const teamRef = useRef(null);
  const teamInView = useInView(teamRef, { once: true, margin: '-100px' });

  const fallbackStats: Stats = {
    totalRaised: 0,
    donorCount: 0,
    remaining: 10000000,
    goal: 10000000,
    progressPercent: 0,
  };

  const fallbackSchedule: PrayerSchedule = {
    fajr: '04:30',
    dhuhr: '13:00',
    asr: '17:00',
    maghrib: '21:00',
    isha: '22:30',
    juma: '13:00',
  };

  const fallbackDonations: Donation[] = [];

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash === '#donation-widget') {
      setTimeout(() => {
        const widget = document.getElementById('donation-widget');
        if (widget) {
          const rect = widget.getBoundingClientRect();
          const offset = rect.top + window.scrollY - 100;
          window.scrollTo({ top: Math.max(0, offset), behavior: 'smooth' });
        }
      }, 300);
    }
  }, [mounted]);

  useEffect(() => {
    fetchStats();
    loadDonations(8, 0);

    fetch('/api/schedule')
      .then(res => res.json())
      .then(data => {
        if (!data.error) setSchedule(data);
        else setSchedule(fallbackSchedule);
      })
      .catch(() => setSchedule(fallbackSchedule));

    fetch('/api/events')
      .then(res => res.json())
      .then(data => {
        if (!data.error) setEvents(data);
      })
      .catch(() => {});

    fetch('/api/gallery')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setGalleryPhotos(data.map((img: any) => ({ src: img.url, alt: img.description || 'Фото мечети' })));
        }
      })
      .catch(() => {});
  }, []);

  const fetchStats = () => {
    fetch('/api/stats')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(() => setStats(fallbackStats));
  };

  const loadDonations = (limit: number, offset: number) => {
    fetch(`/api/donations?status=succeeded&limit=${limit}&offset=${offset}`)
      .then(res => res.json())
      .then(data => {
        if (!data.error && data.donations) {
          setRecentDonations(data.donations);
        } else {
          setRecentDonations([]);
        }
      })
      .catch(() => setRecentDonations([]));
  };

  const loadMoreDonations = () => {
    setIsLoadingMore(true);
    const newLimit = donationLimit + 8;
    setDonationLimit(newLimit);
    loadDonations(newLimit, 0);
    setTimeout(() => {
      setIsLoadingMore(false);
    }, 300);
  };

  useEffect(() => {
    if (!schedule) return;

    const calcNextPrayer = () => {
      const now = new Date();
      const prayers = [
        { name: 'Фаджр', time: schedule.fajr },
        { name: 'Зухр', time: schedule.dhuhr },
        { name: 'Аср', time: schedule.asr },
        { name: 'Магриб', time: schedule.maghrib },
        { name: 'Иша', time: schedule.isha },
      ];

      for (const prayer of prayers) {
        const [h, m] = prayer.time.split(':').map(Number);
        const prayerDate = new Date(now);
        prayerDate.setHours(h, m, 0, 0);

        if (prayerDate > now) {
          const diff = Math.floor((prayerDate.getTime() - now.getTime()) / 1000);
          const hours = Math.floor(diff / 3600);
          const minutes = Math.floor((diff % 3600) / 60);
          const seconds = diff % 60;

          setNextPrayer({
            name: prayer.name,
            time: prayer.time,
            remaining: `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`,
          });
          return;
        }
      }

      const [fh] = schedule.fajr.split(':').map(Number);
      const fajrTomorrow = new Date(now);
      fajrTomorrow.setDate(fajrTomorrow.getDate() + 1);
      fajrTomorrow.setHours(fh, 0, 0, 0);

      const diff = Math.floor((fajrTomorrow.getTime() - now.getTime()) / 1000);
      const hours = Math.floor(diff / 3600);
      const minutes = Math.floor((diff % 3600) / 60);
      const seconds = diff % 60;

      setNextPrayer({
        name: 'Фаджр',
        time: schedule.fajr,
        remaining: `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`,
      });
    };

    calcNextPrayer();
    const timer = setInterval(calcNextPrayer, 1000);
    return () => clearInterval(timer);
  }, [schedule]);

  useEffect(() => {
    if (galleryPhotos.length <= 3) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % galleryPhotos.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [galleryPhotos.length]);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % galleryPhotos.length);
  }, [galleryPhotos.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + galleryPhotos.length) % galleryPhotos.length);
  }, [galleryPhotos.length]);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxPhoto(galleryPhotos[index]);
  };

  const nextLightbox = () => {
    const next = (lightboxIndex + 1) % galleryPhotos.length;
    setLightboxIndex(next);
    setLightboxPhoto(galleryPhotos[next]);
  };

  const prevLightbox = () => {
    const prev = (lightboxIndex - 1 + galleryPhotos.length) % galleryPhotos.length;
    setLightboxIndex(prev);
    setLightboxPhoto(galleryPhotos[prev]);
  };

  const handleTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchMove = (e: React.TouchEvent) => { touchEndX.current = e.touches[0].clientX; };
  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) nextSlide();
      else prevSlide();
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => { isDragging.current = true; dragStartX.current = e.clientX; };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    const diff = dragStartX.current - e.clientX;
    if (Math.abs(diff) > 80) {
      if (diff > 0) nextSlide();
      else prevSlide();
      isDragging.current = false;
    }
  };
  const handleMouseUp = () => { isDragging.current = false; };

  useEffect(() => {
    if (!lightboxPhoto) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxPhoto(null);
      if (e.key === 'ArrowRight') nextLightbox();
      if (e.key === 'ArrowLeft') prevLightbox();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [lightboxPhoto, lightboxIndex, galleryPhotos.length]);

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diff < 60) return 'только что';
    if (diff < 3600) return `${Math.floor(diff / 60)} мин назад`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} ч назад`;
    return format(date, 'dd.MM.yyyy');
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('ru-RU').format(num);
  };

  const getDonorWord = (count: number) => {
    const lastTwo = count % 100;
    const lastOne = count % 10;
    if (lastTwo >= 11 && lastTwo <= 19) return 'человек';
    if (lastOne === 1) return 'человек';
    if (lastOne >= 2 && lastOne <= 4) return 'человека';
    return 'человек';
  };

  const formatPhone = (d: string): string => {
    if (!d) return '+7';
    let s = '+7';
    if (d.length > 1) s += ' (' + d.substring(1, Math.min(4, d.length));
    if (d.length >= 4) s += ')';
    if (d.length > 4) s += ' ' + d.substring(4, Math.min(7, d.length));
    if (d.length > 7) s += '-' + d.substring(7, Math.min(9, d.length));
    if (d.length > 9) s += '-' + d.substring(9, Math.min(11, d.length));
    return s;
  };

  const handlePhoneChange = (value: string) => {
    let digits = value.replace(/\D/g, '');
    if (digits.length === 0) {
      setPhone('+7');
      setPhoneError('');
      return;
    }
    if (digits[0] !== '7') digits = '7' + digits;
    digits = digits.substring(0, 11);
    setPhone(formatPhone(digits));
    setPhoneError('');
  };

  const handleDonateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!consentGiven) {
      setWidgetError('Необходимо дать согласие на обработку персональных данных');
      return;
    }

    if (isRecurring && phone.replace(/\D/g, '').length < 11) {
      setPhoneError('Введите корректный номер телефона');
      return;
    }

    setWidgetError('');
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/donations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: parseFloat(donateAmount) || 0,
          donorName: isAnonymous ? 'Аноним' : 'Брат/Сестра',
          isRecurring,
          phone: isRecurring ? phone : null,
        }),
      });

      const data = await res.json();
      if (data.confirmationUrl) {
        window.location.href = data.confirmationUrl;
      } else {
        setWidgetError(data.error || 'Попробуйте ещё раз');
      }
    } catch (err) {
      setWidgetError('Проверьте подключение к интернету');
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayStats = mounted ? (stats || fallbackStats) : fallbackStats;
  const displaySchedule = schedule || fallbackSchedule;

  return (
    <div className="flex flex-col">
      {/* ═══════════════════════════════════════════════════════════════
          HERO — Full-screen parallax with mosque image
          ═══════════════════════════════════════════════════════════════ */}
      <section ref={heroRef} className="relative min-h-screen flex items-center">
        {/* Background image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/media/Главный_план.jpg"
            alt="Мечеть Фатиха"
            fill
            sizes="100vw"
            quality={75}
            className="object-cover object-center"
            priority
          />
        </div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80 z-10" />

        {/* Hero content */}
        <div
          className="relative z-20 w-full container mx-auto px-4 md:px-8"
        >
          <div className="flex flex-col lg:flex-row gap-12 items-center min-h-screen py-32">
            {/* Left: Text content */}
            <div className="flex-1 text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <p className="text-white/80 text-xs font-bold uppercase tracking-[0.25em] mb-4">
                  Сбор на реконструкцию
                </p>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white leading-[1.05] mb-6"
              >
                Мечеть
                <br />
                <span className="text-white">Фатиха</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-white/60 text-lg font-medium mb-8"
              >
                г. Бирск, ул. Мира, 1
              </motion.p>

              {/* Stats row */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex flex-wrap items-center gap-6 justify-center lg:justify-start mb-8"
              >
                <div className="bg-white/15 px-5 py-3 rounded-2xl border border-white/10">
                  <span className="text-white text-2xl font-bold" suppressHydrationWarning>
                    <AnimatedCounter value={Math.floor(displayStats.totalRaised)} /> ₽
                  </span>
                </div>
                <div className="text-white/40 text-sm">
                  из {formatNumber(displayStats.goal)} ₽
                </div>
                <div className="bg-white/15 px-3 py-1.5 rounded-full border border-white/20">
                  <span className="text-white text-sm font-bold" suppressHydrationWarning>
                    {displayStats.progressPercent}%
                  </span>
                </div>
              </motion.div>

              {/* Progress bar */}
              <motion.div
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="w-full max-w-lg h-2 bg-white/10 rounded-full overflow-hidden mb-8 origin-left"
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.max(displayStats.progressPercent, 2)}%` }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className="h-full bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-primary)] rounded-full"
                />
              </motion.div>

              {/* Secondary stats */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="flex items-center gap-8 justify-center lg:justify-start"
              >
                <div>
                  <div className="text-white text-xl font-bold" suppressHydrationWarning>
                    <AnimatedCounter value={displayStats.donorCount} /> {getDonorWord(displayStats.donorCount)}
                  </div>
                  <div className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Поддерживают</div>
                </div>
                <div className="w-px h-8 bg-white/20" />
                <div>
                  <div className="text-white text-xl font-bold" suppressHydrationWarning>
                    <AnimatedCounter value={Math.floor(displayStats.remaining)} /> ₽
                  </div>
                  <div className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Осталось</div>
                </div>
              </motion.div>
            </div>

            {/* Right: Donation widget */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="hidden lg:block flex-none w-full max-w-[420px] lg:w-[420px]"
              id="donation-widget"
            >
              <div className="bg-white rounded-3xl p-6 shadow-2xl" style={{ boxShadow: '0 30px 80px rgba(0, 0, 0, 0.3)' }}>
                <h2 className="text-xl font-bold mb-5" style={{ color: 'var(--color-text)', fontFamily: 'var(--font-playfair)' }}>Помочь сейчас</h2>

                <div className="flex p-1 rounded-xl mb-4" style={{ backgroundColor: '#f3f4f6' }}>
                  <button onClick={() => setIsRecurring(false)} className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all duration-200 ${!isRecurring ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400'}`}>Единоразово</button>
                  <button onClick={() => setIsRecurring(true)} className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all duration-200 ${isRecurring ? 'text-white shadow-sm' : 'text-gray-400'}`} style={isRecurring ? { backgroundColor: 'var(--color-primary)' } : {}}>Регулярно</button>
                </div>

                <div className="space-y-3 mb-4">
                  <input type="text" placeholder="Ваше имя" disabled={isAnonymous} className="w-full h-11 px-4 bg-white rounded-xl font-medium text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed" style={{ border: '1.5px solid #e5e7eb', color: 'var(--color-text)' }} onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--color-primary)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(13, 124, 95, 0.1)'; }} onBlur={(e) => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.boxShadow = 'none'; }} />
                  <button onClick={() => setIsAnonymous(!isAnonymous)} className={`w-full h-10 rounded-xl border text-xs font-bold transition-all duration-200`} style={isAnonymous ? { backgroundColor: 'var(--color-primary)', borderColor: 'var(--color-primary)', color: 'white' } : { borderColor: '#e5e7eb', color: '#9ca3af' }}>{isAnonymous ? '✓ Анонимно' : 'Анонимно'}</button>
                </div>

                {isRecurring && (
                  <div className="mb-4">
                    <label className="block text-xs font-bold mb-1.5" style={{ color: '#9ca3af' }}>Телефон <span className="text-red-400">*</span></label>
                    <input type="tel" value={phone} onChange={(e) => handlePhoneChange(e.target.value)} placeholder="+7 (___) ___-__-__" className="w-full h-11 px-4 bg-white rounded-xl font-medium text-sm transition-all duration-200" style={{ border: `1.5px solid ${phoneError ? '#dc2626' : '#e5e7eb'}`, color: 'var(--color-text)' }} onFocus={(e) => { e.currentTarget.style.borderColor = phoneError ? '#dc2626' : 'var(--color-primary)'; }} onBlur={(e) => { if (!phoneError) e.currentTarget.style.borderColor = '#e5e7eb'; }} />
                    {phoneError && <p className="text-xs font-bold mt-1" style={{ color: '#dc2626' }}>{phoneError}</p>}
                  </div>
                )}

                <div className="mb-4">
                  <label className="block text-xs font-bold mb-1.5" style={{ color: '#9ca3af' }}>Сумма (₽)</label>
                  <div className="flex gap-2 flex-wrap mb-2">
                    {['500', '1000', '3000', '5000'].map((amt) => (
                      <button key={amt} type="button" onClick={() => setDonateAmount(amt)} className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200" style={donateAmount === amt ? { backgroundColor: 'var(--color-text)', color: 'white' } : { backgroundColor: '#f3f4f6', color: '#9ca3af' }}>{amt} ₽</button>
                    ))}
                  </div>
                  <input type="text" inputMode="numeric" value={donateAmount} onChange={(e) => setDonateAmount(e.target.value.replace(/[^0-9]/g, ''))} placeholder="Своя сумма" className="w-full h-10 px-3 bg-white rounded-xl text-sm font-medium" style={{ border: '1.5px solid #e5e7eb', color: 'var(--color-text)' }} onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--color-primary)'; }} onBlur={(e) => { e.currentTarget.style.borderColor = '#e5e7eb'; }} />
                </div>
                <button type="button" onClick={() => setConsentGiven(!consentGiven)} className="w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 text-left mb-4" style={consentGiven ? { border: '1.5px solid var(--color-primary)', backgroundColor: 'rgba(13, 124, 95, 0.05)' } : { border: '1.5px solid #e5e7eb' }}>
                  <div className="w-5 h-5 rounded-md shrink-0 flex items-center justify-center transition-all duration-200" style={consentGiven ? { backgroundColor: 'var(--color-primary)', border: '1.5px solid var(--color-primary)' } : { border: '1.5px solid #d1d5db' }}>{consentGiven && <CheckCircle size={12} className="text-white" />}</div>
                  <span className="text-xs font-medium" style={{ color: '#6b7280' }}>Согласие на обработку данных и <Link href="/public-offer" className="font-bold hover:underline" style={{ color: 'var(--color-primary)' }}>условия оферты</Link></span>
                </button>
                {widgetError && <div className="p-3 text-sm font-bold rounded-xl text-center mb-4" style={{ backgroundColor: '#fef2f2', color: '#dc2626' }}>{widgetError}</div>}
                <button onClick={handleDonateSubmit} className="w-full h-16 text-white rounded-2xl text-base font-bold transition-all duration-300 hover:shadow-lg" style={{ backgroundColor: 'var(--color-primary)', boxShadow: '0 4px 20px rgba(13, 124, 95, 0.3)' }}>
                  {isRecurring ? 'Оформить подписку' : 'Оплатить через ЮKassa'}
                </button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
        >
          <span className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em]">Листайте вниз</span>
          <div
            className="w-5 h-8 border-2 border-white/20 rounded-full flex justify-center pt-1.5 animate-float"
          >
            <div className="w-1 h-2 bg-white/40 rounded-full" />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          MOBILE DONATION WIDGET (shown below hero on mobile)
          ═══════════════════════════════════════════════════════════════ */}
      <section className="lg:hidden px-4 py-4 relative z-30" style={{ backgroundColor: 'var(--color-bg)' }}>
        <div id="donation-widget" className="bg-white rounded-3xl p-6 shadow-xl" style={{ boxShadow: '0 15px 40px rgba(0, 0, 0, 0.1)' }}>
          <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--color-text)', fontFamily: 'var(--font-playfair)' }}>Помочь сейчас</h2>

          <div className="flex p-1 rounded-xl mb-4" style={{ backgroundColor: '#f3f4f6' }}>
            <button onClick={() => setIsRecurring(false)} className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all duration-200 ${!isRecurring ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400'}`}>Единоразово</button>
            <button onClick={() => setIsRecurring(true)} className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all duration-200 ${isRecurring ? 'text-white shadow-sm' : 'text-gray-400'}`} style={isRecurring ? { backgroundColor: 'var(--color-primary)' } : {}}>Регулярно</button>
          </div>

          <div className="space-y-3 mb-4">
            <input type="text" placeholder="Ваше имя" disabled={isAnonymous} className="w-full h-10 px-4 bg-white rounded-xl font-medium text-sm transition-all duration-200 disabled:opacity-50" style={{ border: '1.5px solid #e5e7eb', color: 'var(--color-text)' }} onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--color-primary)'; }} onBlur={(e) => { e.currentTarget.style.borderColor = '#e5e7eb'; }} />
            <button onClick={() => setIsAnonymous(!isAnonymous)} className="w-full h-9 rounded-lg border text-xs font-bold transition-all duration-200" style={isAnonymous ? { backgroundColor: 'var(--color-primary)', borderColor: 'var(--color-primary)', color: 'white' } : { borderColor: '#e5e7eb', color: '#9ca3af' }}>{isAnonymous ? '✓ Анонимно' : 'Анонимно'}</button>
          </div>

          {isRecurring && (
            <div className="mb-4">
              <label className="block text-xs font-bold mb-1.5" style={{ color: '#9ca3af' }}>Телефон <span className="text-red-400">*</span></label>
              <input type="tel" value={phone} onChange={(e) => handlePhoneChange(e.target.value)} placeholder="+7 (___) ___-__-__" className="w-full h-10 px-3 bg-white rounded-xl text-sm font-medium transition-all duration-200" style={{ border: `1.5px solid ${phoneError ? '#dc2626' : '#e5e7eb'}`, color: 'var(--color-text)' }} onFocus={(e) => { e.currentTarget.style.borderColor = phoneError ? '#dc2626' : 'var(--color-primary)'; }} onBlur={(e) => { if (!phoneError) e.currentTarget.style.borderColor = '#e5e7eb'; }} />
              {phoneError && <p className="text-xs font-bold mt-1" style={{ color: '#dc2626' }}>{phoneError}</p>}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-xs font-bold mb-1.5" style={{ color: '#9ca3af' }}>Сумма (₽)</label>
            <div className="flex gap-1.5 flex-wrap mb-2">
              {['500', '1000', '3000', '5000'].map((amt) => (
                <button key={amt} type="button" onClick={() => setDonateAmount(amt)} className="px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all duration-200" style={donateAmount === amt ? { backgroundColor: 'var(--color-text)', color: 'white' } : { backgroundColor: '#f3f4f6', color: '#9ca3af' }}>{amt} ₽</button>
              ))}
            </div>
            <input type="text" inputMode="numeric" value={donateAmount} onChange={(e) => setDonateAmount(e.target.value.replace(/[^0-9]/g, ''))} placeholder="Своя сумма" className="w-full h-9 px-3 bg-white rounded-xl text-sm font-medium" style={{ border: '1.5px solid #e5e7eb', color: 'var(--color-text)' }} onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--color-primary)'; }} onBlur={(e) => { e.currentTarget.style.borderColor = '#e5e7eb'; }} />
          </div>
          <button type="button" onClick={() => setConsentGiven(!consentGiven)} className="w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 text-left mb-4" style={consentGiven ? { border: '1.5px solid var(--color-primary)', backgroundColor: 'rgba(13, 124, 95, 0.05)' } : { border: '1.5px solid #e5e7eb' }}>
            <div className="w-5 h-5 rounded-md shrink-0 flex items-center justify-center transition-all duration-200" style={consentGiven ? { backgroundColor: 'var(--color-primary)', border: '1.5px solid var(--color-primary)' } : { border: '1.5px solid #d1d5db' }}>{consentGiven && <CheckCircle size={12} className="text-white" />}</div>
            <span className="text-xs font-medium" style={{ color: '#6b7280' }}>Согласие и <Link href="/public-offer" className="font-bold hover:underline" style={{ color: 'var(--color-primary)' }}>условия оферты</Link></span>
          </button>
          {widgetError && <div className="p-3 text-sm font-bold rounded-xl text-center mb-4" style={{ backgroundColor: '#fef2f2', color: '#dc2626' }}>{widgetError}</div>}
          <button onClick={handleDonateSubmit} className="w-full h-14 text-white rounded-2xl text-base font-bold transition-all duration-300" style={{ backgroundColor: 'var(--color-primary)', boxShadow: '0 4px 20px rgba(13, 124, 95, 0.3)' }}>
            {isRecurring ? 'Оформить подписку' : 'Оплатить через ЮKassa'}
          </button>
          </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          ABOUT — Light section with parallax offset
          ═══════════════════════════════════════════════════════════════ */}
      <IslamicPatternDivider />
      <section ref={aboutRef} className="py-20 md:py-28 relative overflow-hidden">
        <div className="hidden min-[1800px]:block absolute left-12 top-20 w-80 pointer-events-none">
          <Image src="/media/Имам-Хатыб-Photoroom.png" alt="" width={512} height={512} className="w-full h-auto object-contain" />
        </div>
        <div className="hidden min-[1800px]:block absolute right-12 top-20 w-80 pointer-events-none">
          <Image src="/media/Имам-Ахунд-Photoroom.png" alt="" width={512} height={512} className="w-full h-auto object-contain" />
        </div>
        <div className="container mx-auto px-4 max-w-4xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={aboutInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <p className="text-[var(--color-accent)] text-xs font-bold uppercase tracking-[0.2em] text-center mb-3">О мечети</p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl mb-8 text-center" style={{ color: 'var(--color-text)', fontFamily: 'var(--font-playfair)' }}>
              Место покоя и знания
            </h2>
          </motion.div>

          <div className="space-y-6 text-base md:text-lg leading-relaxed text-center md:text-left">
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={aboutInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-lg font-semibold text-[var(--color-primary)]"
            >
              Ассаляму алейкум ва рахматуллахи ва баракатух.
            </motion.p>
            
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={aboutInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3 }}
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Мечеть Фатиха в г. Бирске продолжает сбор средств для расширения и реконструкции мечети, расположенной по адресу, ул. Мира, 1.
            </motion.p>
            
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={aboutInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Просим вас ради довольства Аллаха, оказывать посильную материальную помощь и делится данной информацией в социальных сетях.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={aboutInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="p-8 rounded-3xl relative overflow-hidden"
              style={{ backgroundColor: 'var(--color-primary-light)' }}
            >
              <div className="absolute inset-0 islamic-pattern-light" />
              <div className="relative z-10 space-y-4">
                <p className="text-2xl md:text-3xl font-bold text-center leading-loose" dir="rtl" style={{ fontFamily: 'serif' }}>
                  يَا أَيُّهَا الَّذِينَ آمَنُوا إِن تَنصُرُوا اللَّهَ يَنصُرْكُمْ وَيُثَبِّتْ أَقْدَامَكُمْ
                </p>
                <p className="text-center font-semibold text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  &quot;О те, которые уверовали! Если вы поможете Аллаху, то и Он поможет вам и утвердит ваши стопы.&quot;
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={aboutInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="pl-6 py-3 text-left"
              style={{ borderLeft: '3px solid var(--color-accent)' }}
            >
              <p className="text-xs font-medium" style={{ color: 'var(--color-text-muted)' }}>Пророк Мухаммад (Да благословит его Аллах и приветствует) сказал:</p>
              <p className="text-sm font-bold uppercase mt-2 tracking-wide" style={{ color: 'var(--color-text)' }}>
                «КТО ПОСТРОИТ МЕЧЕТЬ РАДИ АЛЛАХА, ТОМУ АЛЛАХ ПОСТРОИТ ДОМ В РАЮ»
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          PRAYER TIMES — Dark full-bleed section with parallax
          ═══════════════════════════════════════════════════════════════ */}
      <section ref={prayerRef} className="dark-section py-20 md:py-28 relative overflow-hidden">
        <div className="absolute inset-0 islamic-pattern opacity-[0.02]" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--color-primary)]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[var(--color-accent)]/5 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={prayerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <p className="text-[var(--color-accent)] text-xs font-bold uppercase tracking-[0.2em] mb-3">Время намаза</p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl text-white mb-2">
              Расписание
            </h2>
            <p className="text-white/40 font-semibold text-sm uppercase tracking-widest">
              {format(new Date(), 'EEEE, d MMMM', { locale: ru })}
            </p>
          </motion.div>

          {nextPrayer && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={prayerInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex justify-center mb-10"
            >
              <div className="bg-white/5 backdrop-blur-md px-8 py-4 rounded-2xl border border-white/10 text-center">
                <div className="text-[10px] uppercase font-bold tracking-widest mb-1 text-white/40">Следующий намаз</div>
                <div className="text-white text-lg font-bold">{nextPrayer.name}</div>
                <div className="font-mono text-3xl font-bold text-[var(--color-accent)]">{nextPrayer.remaining}</div>
              </div>
            </motion.div>
          )}

          <div className="grid grid-cols-3 md:grid-cols-6 gap-3 md:gap-4 max-w-4xl mx-auto">
            {[
              { name: 'Фаджр', time: displaySchedule.fajr, icon: '🌅' },
              { name: 'Зухр', time: displaySchedule.dhuhr, icon: '☀️' },
              { name: 'Аср', time: displaySchedule.asr, icon: '🌤️' },
              { name: 'Магриб', time: displaySchedule.maghrib, icon: '🌅' },
              { name: 'Иша', time: displaySchedule.isha, icon: '🌙' },
              { name: 'Джума', time: displaySchedule.juma, icon: '🕌' },
            ].map((prayer, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={prayerInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.1 * i }}
                className={`p-4 md:p-5 rounded-2xl text-center transition-all duration-500 ${
                  nextPrayer?.name === prayer.name
                    ? 'bg-[var(--color-primary)] text-white shadow-glow animate-pulse-glow'
                    : 'bg-white/5 text-white border border-white/5'
                }`}
              >
                <div className="text-2xl mb-2">{prayer.icon}</div>
                <div className="text-[9px] uppercase font-bold tracking-widest mb-1.5 text-white/40">{prayer.name}</div>
                <div className="font-mono text-lg font-bold">{prayer.time}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          GALLERY — Light section with parallax offset
          ═══════════════════════════════════════════════════════════════ */}
      <section ref={galleryRef} className="py-20 md:py-28 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={galleryInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <p className="text-[var(--color-accent)] text-xs font-bold uppercase tracking-[0.2em] mb-3">Галерея</p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl mb-4" style={{ color: 'var(--color-text)', fontFamily: 'var(--font-playfair)' }}>
              Фотографии мечети
            </h2>
          </motion.div>

          {/* Desktop gallery */}
          <div className="hidden md:block relative">
            <div className="overflow-hidden rounded-3xl" onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
              {galleryPhotos.length === 0 ? (
                <div className="flex items-center justify-center h-64 bg-[var(--color-bg-deep)] rounded-3xl text-[var(--color-text-muted)] text-sm font-bold">
                  Фотографии пока не добавлены
                </div>
              ) : galleryPhotos.length <= 3 ? (
                <div className="flex gap-4">
                  {galleryPhotos.map((photo, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 30 }}
                      animate={galleryInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.6, delay: 0.1 * i }}
                      className="flex-1 aspect-[16/10] relative rounded-2xl overflow-hidden group cursor-pointer"
                      onClick={() => openLightbox(i)}
                    >
                      <Image src={photo.src} alt={photo.alt} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500" />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="flex gap-4 transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentSlide * (100 / 3 + 1.5)}%)` }}>
                  {galleryPhotos.map((photo, i) => (
                    <div key={i} className="min-w-[calc(33.333%-11px)] aspect-[16/10] relative rounded-2xl overflow-hidden group cursor-pointer" onClick={() => openLightbox(i)}>
                      <Image src={photo.src} alt={photo.alt} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500" />
                    </div>
                  ))}
                </div>
              )}
            </div>
            {galleryPhotos.length > 3 && (
              <>
                <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-xl z-10 transition-all duration-300 hover:scale-110">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M15 18l-6-6 6-6" stroke="#0f1a14" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
                <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-xl z-10 transition-all duration-300 hover:scale-110">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="#0f1a14" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                  {Array.from({ length: Math.ceil(galleryPhotos.length / 3) }).map((_, i) => (
                    <button key={i} onClick={() => setCurrentSlide(i * 3)} className={`h-2 rounded-full transition-all duration-300 ${Math.floor(currentSlide / 3) === i ? 'bg-[var(--color-primary)] w-8' : 'bg-white/40 w-2 hover:bg-white/60'}`} />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Mobile gallery */}
          <div className="md:hidden relative overflow-hidden rounded-3xl aspect-[16/10]" onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
            {galleryPhotos.length === 0 ? (
              <div className="w-full h-full flex items-center justify-center bg-[var(--color-bg-deep)] rounded-3xl text-[var(--color-text-muted)] text-sm font-bold">
                Фотографии пока не добавлены
              </div>
            ) : galleryPhotos.length <= 1 ? (
              <div className="w-full h-full relative cursor-pointer" onClick={() => openLightbox(0)}>
                <Image src={galleryPhotos[0].src} alt={galleryPhotos[0].alt} fill className="object-cover" />
              </div>
            ) : (
              <>
                <div className="flex transition-transform duration-500 ease-in-out h-full" style={{ transform: `translateX(-${(currentSlide % galleryPhotos.length) * 100}%)` }}>
                  {galleryPhotos.map((photo, i) => (
                    <div key={i} className="min-w-full h-full relative cursor-pointer" onClick={() => openLightbox(i)}>
                      <Image src={photo.src} alt={photo.alt} fill className="object-cover" />
                    </div>
                  ))}
                </div>
                <button onClick={prevSlide} className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/70 hover:bg-white rounded-full flex items-center justify-center shadow-lg z-10 transition-all duration-200">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M15 18l-6-6 6-6" stroke="#0f1a14" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
                <button onClick={nextSlide} className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/70 hover:bg-white rounded-full flex items-center justify-center shadow-lg z-10 transition-all duration-200">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="#0f1a14" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                  {galleryPhotos.map((_, i) => (
                    <button key={i} className={`h-1.5 rounded-full transition-all duration-300 ${(currentSlide % galleryPhotos.length) === i ? 'bg-white w-5' : 'bg-white/40 w-1.5'}`} />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Lightbox */}
          <AnimatePresence>
            {lightboxPhoto && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[500] bg-black/95 flex items-center justify-center"
                onClick={(e) => { if (e.target === e.currentTarget) setLightboxPhoto(null); }}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={() => { const diff = touchStartX.current - touchEndX.current; if (Math.abs(diff) > 50) { if (diff > 0) nextLightbox(); else prevLightbox(); } }}
              >
                <button className="absolute top-6 right-6 text-white/60 hover:text-white z-10 p-2 transition-colors" onClick={() => setLightboxPhoto(null)}>
                  <X size={32} />
                </button>
                <button className="absolute left-6 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white z-10 transition-all duration-200" onClick={prevLightbox}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M15 18l-6-6 6-6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="relative max-w-5xl max-h-[85vh] w-full h-full p-4"
                >
                  <Image src={lightboxPhoto.src} alt={lightboxPhoto.alt} fill className="object-contain" />
                </motion.div>
                <button className="absolute right-6 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white z-10 transition-all duration-200" onClick={nextLightbox}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/50 text-sm font-bold bg-black/40 px-4 py-2 rounded-full backdrop-blur-sm">
                  {lightboxIndex + 1} / {galleryPhotos.length}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SERVICES — Light section
          ═══════════════════════════════════════════════════════════════ */}
      <IslamicPatternDivider />
      <section ref={servicesRef} className="py-20 md:py-28 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={servicesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="flex flex-col md:flex-row justify-between items-center md:items-end gap-4 mb-12 text-center"
          >
            <div>
              <p className="text-[var(--color-accent)] text-xs font-bold uppercase tracking-[0.2em] mb-3">Услуги</p>
              <h2 className="text-3xl md:text-4xl lg:text-5xl" style={{ color: 'var(--color-text)', fontFamily: 'var(--font-playfair)' }}>
                Услуги мечети
              </h2>
            </div>
            <Link href="/help" className="font-bold flex items-center gap-1 uppercase text-[10px] tracking-widest" style={{ color: 'var(--color-primary)' }}>
              Все услуги <ChevronRight size={12} />
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: 'Джаназа', desc: 'Похоронная молитва', topic: 'Джаназа (похоронная молитва)', icon: '🕌' },
              { title: 'Никях', desc: 'Исламский брак', topic: 'Никях (исламский брак)', icon: '💍' },
              { title: 'Консультация', desc: 'С имамом', topic: 'Консультация имама', icon: '📖' },
              { title: 'Хадж/Умра', desc: 'Паломничество', topic: 'Уроки для паломников', icon: '🕋' },
            ].map((service, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={servicesInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.1 * i }}
              >
                <Link
                  href={`/contact?topic=${encodeURIComponent(service.topic)}`}
                  className="block rounded-2xl p-6 transition-all duration-300 group hover:shadow-xl hover:-translate-y-2"
                  style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
                >
                  <div className="text-3xl mb-4">{service.icon}</div>
                  <h3 className="font-bold text-lg mb-1" style={{ color: 'var(--color-text)' }}>{service.title}</h3>
                  <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>{service.desc}</p>
                  <div className="mt-4 flex items-center gap-1 text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ color: 'var(--color-primary)' }}>
                    Подробнее <ChevronRight size={12} />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          DONATIONS WALL — Dark full-bleed section
          ═══════════════════════════════════════════════════════════════ */}
      <section ref={donationsRef} className="dark-section py-20 md:py-28 relative overflow-hidden">
        <div className="absolute inset-0 islamic-pattern opacity-[0.02]" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={donationsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <p className="text-[var(--color-accent)] text-xs font-bold uppercase tracking-[0.2em] mb-3">Благотворители</p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl text-white mb-4">
              Все поступления
            </h2>
          </motion.div>

          <div className="max-w-3xl mx-auto">
            {recentDonations.length > 0 ? (
              <div className="space-y-3 mb-8">
                {recentDonations.map((donation, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -30 }}
                    animate={donationsInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.05 * i }}
                    className="p-4 rounded-2xl flex items-center justify-between bg-white/5 border border-white/5 hover:bg-white/10 transition-colors duration-300"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm bg-[var(--color-primary)]/20 text-[var(--color-primary)]">
                        {donation.donorName.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-sm text-white">{donation.donorName}</div>
                        <div className="text-[9px] font-bold uppercase tracking-widest text-white/30">{getTimeAgo(donation.createdAt)}</div>
                      </div>
                    </div>
                    <div className="font-bold text-lg text-[var(--color-accent)]">{formatNumber(Math.floor(donation.amount))} ₽</div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={donationsInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.6 }}
                className="p-10 rounded-3xl text-center bg-white/5 border border-white/5"
              >
                <XCircle className="mx-auto mb-4 text-white/20" size={36} />
                <p className="font-bold uppercase text-[10px] tracking-widest text-white/30">Пока нет пожертвований</p>
              </motion.div>
            )}
            <div className="text-center">
              <button onClick={loadMoreDonations} disabled={isLoadingMore} className="px-10 py-3.5 rounded-2xl font-bold text-[10px] uppercase tracking-widest transition-all duration-300 disabled:opacity-50 bg-white/10 text-white hover:bg-white/20 border border-white/10">
                {isLoadingMore ? <RefreshCw className="animate-spin mr-2 inline" size={14} /> : null} Загрузить ещё
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          TEAM — Light section
          ═══════════════════════════════════════════════════════════════ */}
      <section ref={teamRef} className="py-20 md:py-28 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={teamInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <p className="text-[var(--color-accent)] text-xs font-bold uppercase tracking-[0.2em] mb-3">Команда</p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl" style={{ color: 'var(--color-text)', fontFamily: 'var(--font-playfair)' }}>
              Команда мечети
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 gap-6 md:gap-8 max-w-lg md:max-w-xl mx-auto">
            {[
              { name: 'имам-хатыб', image: '/media/Имам-Хатыб.jpg' },
              { name: 'имам-ахунд', image: '/media/Имам-Ахунд.jpg' },
            ].map((member, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={teamInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.15 * i }}
                className="rounded-3xl overflow-hidden group hover:shadow-xl transition-shadow duration-500"
                style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
              >
                <div className="aspect-[3/4] relative overflow-hidden">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-center">
                    <h3 className="font-bold text-base md:text-lg text-white">{member.name}</h3>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          EVENTS — Dark section (conditional)
          ═══════════════════════════════════════════════════════════════ */}
      {events.length > 0 && (
        <section className="dark-section py-20 md:py-28 relative overflow-hidden">
          <div className="absolute inset-0 islamic-pattern opacity-[0.02]" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-end gap-4 mb-12">
              <div>
                <p className="text-[var(--color-accent)] text-xs font-bold uppercase tracking-[0.2em] mb-3">Мероприятия</p>
                <h2 className="text-3xl md:text-4xl lg:text-5xl text-white">
                  Ближайшие события
                </h2>
              </div>
              {events.length > 0 && (
                <button onClick={() => setShowAllEvents(!showAllEvents)} className="font-bold flex items-center gap-1 uppercase text-[10px] tracking-widest text-[var(--color-accent)]">
                  {showAllEvents ? 'Свернуть' : 'Все'} <ChevronRight size={12} className={`transition-transform duration-200 ${showAllEvents ? 'rotate-90' : ''}`} />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(showAllEvents ? events : events.slice(0, 3)).map((event: any, i: number) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1 * i }}
                  className="rounded-3xl overflow-hidden bg-white/5 border border-white/5 hover:bg-white/10 transition-all duration-300"
                >
                  {event.imageUrl ? (
                    <div className="relative h-40 overflow-hidden">
                      <Image src={event.imageUrl} alt={event.title} fill className="object-cover" />
                    </div>
                  ) : (
                    <div className="h-40 flex items-center justify-center bg-white/5">
                      <Calendar size={36} className="text-white/10" />
                    </div>
                  )}
                  <div className="p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-accent)]">
                        {format(new Date(event.date), 'd MMMM', { locale: ru })}
                      </div>
                      <div className="text-[10px] flex items-center gap-1 text-white/30">
                        <Clock size={10} /> {format(new Date(event.date), 'HH:mm')}
                      </div>
                    </div>
                    <h3 className="font-bold text-base mb-2 text-white">{event.title}</h3>
                    <p className="text-sm leading-relaxed line-clamp-2 text-white/40">{event.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
