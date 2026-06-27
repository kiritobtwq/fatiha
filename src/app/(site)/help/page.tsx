'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MessageSquare, Heart, BookOpen, GraduationCap, ArrowRight } from 'lucide-react';

interface Service {
  id: number;
  title: string;
  description: string;
  imageUrl: string | null;
  icon?: any;
  topic?: string;
}

const FALLBACK_SERVICES: Service[] = [
  { id: 1, title: 'Джаназа', description: 'Помощь в организации похорон по исламским традициям. Мы поддерживаем семьи в трудные моменты — от подготовки к обряду до проведения всех необходимых молитв.', imageUrl: null, icon: Heart, topic: 'Джаназа (похоронная молитва)' },
  { id: 2, title: 'Никях', description: 'Проведение обряда бракосочетания. Создадим атмосферу духовности для вашего важного дня. Обряд по всем исламским нормам.', imageUrl: null, icon: BookOpen, topic: 'Никях (исламский брак)' },
  { id: 3, title: 'Консультация имама', description: 'Индивидуальная консультация с имамом по религиозным и жизненным вопросам. Получите ответы на любые вопросы по исламу.', imageUrl: null, icon: MessageSquare, topic: 'Консультация имама' },
  { id: 4, title: 'Уроки для паломников', description: 'Подготовка к совершению Хаджа и Умры. Узнайте все необходимые обряды, запреты и рекомендации для вашего паломничества.', imageUrl: null, icon: GraduationCap, topic: 'Уроки для паломников' },
];

const ICON_MAP: Record<string, any> = {
  Heart, BookOpen, MessageSquare, GraduationCap,
};

export default function HelpPage() {
  const [services, setServices] = useState<Service[]>(FALLBACK_SERVICES);

  useEffect(() => {
    fetch('/api/admin/services')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setServices(data);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="font-display font-extrabold text-4xl md:text-5xl text-text-primary mb-6">
            Чем поможем
          </h1>
          <p className="text-text-secondary text-xl font-medium">
            Наши услуги для поддержки вашей духовной жизни
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {services.map((service, i) => {
            const iconKey = ['Heart', 'BookOpen', 'MessageSquare', 'GraduationCap'][i % 4];
            const IconComp = ICON_MAP[iconKey] || Heart;
            const topic = (service as any).topic || service.title;

            return (
              <div key={service.id} className="card-container overflow-hidden">
                {service.imageUrl && (
                  <div className="aspect-[16/9] relative overflow-hidden">
                    <Image src={service.imageUrl} alt={service.title} fill className="object-cover" />
                  </div>
                )}
                <div className="p-8 md:p-12">
                  <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                    <IconComp className="text-primary" size={32} />
                  </div>
                  <h2 className="font-display font-bold text-2xl text-text-primary mb-4">
                    {service.title}
                  </h2>
                  <p className="text-text-secondary text-lg leading-relaxed mb-8">
                    {service.description}
                  </p>
                  <Link href={`/contact?topic=${encodeURIComponent(topic)}`} className="btn-secondary">
                    Оставить заявку <ArrowRight className="ml-2" size={18} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        <div className="card-container bg-bg-accent border-none p-8 md:p-12 rounded-3xl text-center">
          <h3 className="font-display font-bold text-2xl text-text-primary mb-4">
            Не нашли нужную услугу?
          </h3>
          <p className="text-text-secondary text-lg mb-8">
            Свяжитесь с нами — мы постараемся помочь
          </p>
          <Link href="/contact" className="btn-primary">
            Написать нам
          </Link>
        </div>
      </div>
    </div>
  );
}
