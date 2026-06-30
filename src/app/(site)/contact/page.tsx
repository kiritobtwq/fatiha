'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Phone, Mail, MapPin, MessageSquare, CheckCircle, ChevronDown } from 'lucide-react';
import { config } from '@/config';

const TOPICS = [
  'Джаназа (похоронная молитва)',
  'Никях (исламский брак)',
  'Консультация имама',
  'Уроки для паломников',
  'Другое',
];

function ContactForm() {
  const searchParams = useSearchParams();
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [subject, setSubject] = useState('');
  const [customSubject, setCustomSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const topicParam = searchParams.get('topic');
    if (topicParam) {
      setSubject(topicParam);
      setTimeout(() => {
        document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 300);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setIsSubmitting(true);

    const finalSubject = subject === 'Другое' ? customSubject : subject;

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, contact, subject: finalSubject, message }),
      });

      if (res.ok) {
        setSuccess(true);
        setName('');
        setContact('');
        setSubject('');
        setCustomSubject('');
        setMessage('');
      } else {
        const data = await res.json();
        setError(data.error || 'Произошла ошибка');
      }
    } catch (err) {
      setError('Проверьте подключение к интернету');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="font-display font-extrabold text-4xl md:text-5xl text-text-primary mb-6">
              Связаться
            </h1>
            <p className="text-text-secondary text-xl font-medium">
              Мы всегда готовы ответить на ваши вопросы
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            <div className="lg:col-span-2 space-y-6">
              <div className="card-container p-8">
                <h3 className="font-display font-bold text-2xl text-text-primary mb-8">
                  Контакты
                </h3>

                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary shrink-0">
                      <Phone size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-text-primary mb-1">Телефон</h4>
                      <p className="text-text-secondary">{config.mosque.phone || '+7 (3477) 00-00-00'}</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary shrink-0">
                      <Mail size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-text-primary mb-1">Email</h4>
                      <p className="text-text-secondary">{config.mosque.email || 'info@alfatiha-birsk.ru'}</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary shrink-0">
                      <MapPin size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-text-primary mb-1">Адрес</h4>
                      <p className="text-text-secondary">{config.mosque.address || 'г. Бирск, ул. Примерная, 1'}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card-container overflow-hidden" style={{ position: 'relative', overflow: 'hidden', height: 400 }}>
                <a href="https://yandex.ru/maps/20689/birsk/?utm_medium=mapframe&utm_source=maps" style={{ color: '#eee', fontSize: 12, position: 'absolute', top: 0, zIndex: 1 }}>
                  Бирск
                </a>
                <a href="https://yandex.ru/maps/20689/birsk/house/kommunisticheskaya_ulitsa_25/YUwYcwVnTE0GQFtvfXhwdnRqYA==/?ll=55.527581%2C55.417894&utm_medium=mapframe&utm_source=maps&z=17.1" style={{ color: '#eee', fontSize: 12, position: 'absolute', top: 14, zIndex: 1 }}>
                  Коммунистическая улица, 25 — Яндекс Карты
                </a>
                <iframe
                  src="https://yandex.ru/map-widget/v1/?ll=55.527581%2C55.417894&mode=search&ol=geo&ouri=ymapsbm1%3A%2F%2Fgeo%3Fdata%3DCgoxNTM3Nzk3MTUxEnjQoNC-0YHRgdC40Y8sINCg0LXRgdC_0YPQsdC70LjQutCwINCR0LDRiNC60L7RgNGC0L7RgdGC0LDQvSwg0JHQuNGA0YHQuiwg0JrQvtC80LzRg9C90LjRgdGC0LjRh9C10YHQutCw0Y8g0YPQu9C40YbQsCwgMjUiCg09HF5CFeyrXUI%2C&z=17.1"
                  width="100%"
                  height="400"
                  frameBorder="1"
                  allowFullScreen
                  style={{ position: 'relative' }}
                />
              </div>
            </div>

            <div className="lg:col-span-3" id="contact-form">
              <div className="card-container p-8 md:p-12">
                <h3 className="font-display font-bold text-2xl text-text-primary mb-8">
                  Отправить заявку
                </h3>

                {success && (
                  <div className="mb-8 p-6 bg-green-50 border border-green-200 rounded-lg flex items-center gap-4">
                    <CheckCircle className="text-green-600" size={28} />
                    <div>
                      <h4 className="font-bold text-green-800">Заявка отправлена!</h4>
                      <p className="text-sm text-green-700">Мы свяжемся с вами в ближайшее время</p>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-text-secondary uppercase tracking-widest mb-2">
                      Имя *
                    </label>
                    <input
                      required
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Введите ваше имя"
                      className="w-full bg-bg border-2 border-border rounded-lg px-4 py-3 font-semibold text-text-primary focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-text-secondary uppercase tracking-widest mb-2">
                      Телефон или Email *
                    </label>
                    <input
                      required
                      type="text"
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                      placeholder="Ваш контактный телефон или почта"
                      className="w-full bg-bg border-2 border-border rounded-lg px-4 py-3 font-semibold text-text-primary focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-text-secondary uppercase tracking-widest mb-2">
                      Тема
                    </label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setShowDropdown(!showDropdown)}
                        className="w-full bg-bg border-2 border-border rounded-lg px-4 py-3 font-semibold text-text-primary focus:outline-none focus:border-primary flex items-center justify-between"
                      >
                        {subject || 'Выберите тему'}
                        <ChevronDown size={18} className={`transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
                      </button>
                      {showDropdown && (
                        <div className="absolute z-10 w-full mt-1 bg-white border-2 border-border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                          {TOPICS.map((topic) => (
                            <button
                              key={topic}
                              type="button"
                              onClick={() => {
                                setSubject(topic);
                                setShowDropdown(false);
                              }}
                              className="w-full px-4 py-3 text-left font-semibold text-text-primary hover:bg-bg transition-colors"
                            >
                              {topic}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    {subject === 'Другое' && (
                      <input
                        type="text"
                        value={customSubject}
                        onChange={(e) => setCustomSubject(e.target.value)}
                        placeholder="Укажите вашу тему"
                        className="w-full mt-3 bg-bg border-2 border-border rounded-lg px-4 py-3 font-semibold text-text-primary focus:outline-none focus:border-primary"
                      />
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-text-secondary uppercase tracking-widest mb-2">
                      Сообщение *
                    </label>
                    <textarea
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Расскажите, как мы можем помочь..."
                      rows={5}
                      className="w-full bg-bg border-2 border-border rounded-lg px-4 py-3 font-semibold text-text-primary focus:outline-none focus:border-primary resize-none"
                    />
                  </div>

                  {error && <div className="p-4 bg-red-50 text-red-600 text-sm font-bold rounded-lg">{error}</div>}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary w-full justify-center py-4 text-lg gap-2"
                  >
                    {isSubmitting ? (
                      <>Отправка...</>
                    ) : (
                      <>
                        Отправить заявку <MessageSquare size={20} />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>

          <div className="mt-16 text-center">
            <div className="card-container p-8 bg-bg-accent border-none inline-block rounded-3xl">
              <h3 className="font-display font-bold text-2xl text-text-primary mb-6">
                Официальные документы
              </h3>
              <div className="flex flex-wrap justify-center gap-6">
                <a
                  href="/privacy-policy"
                  className="font-semibold text-primary hover:text-primary-dark transition-colors"
                >
                  Политика конфиденциальности
                </a>
                <a
                  href="/public-offer"
                  className="font-semibold text-primary hover:text-primary-dark transition-colors"
                >
                  Публичная оферта
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ContactPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ContactForm />
    </Suspense>
  );
}
