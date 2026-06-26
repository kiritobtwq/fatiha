'use client';

import { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Share2 } from 'lucide-react';
import Image from 'next/image';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

export default function EventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/events')
      .then(res => res.json())
      .then(data => {
        if (!data.error) setEvents(data);
        setLoading(false);
      });
  }, []);

  return (
    <div className="bg-bg-gray min-h-screen py-20">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="mb-12">
          <h1 className="text-4xl font-extrabold text-text-primary mb-4">События мечети</h1>
          <p className="text-text-secondary font-medium">Актуальные мероприятия, лекции и праздники в нашей общине.</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-[40px] h-64 animate-pulse shadow-sm"></div>
            ))}
          </div>
        ) : events.length > 0 ? (
          <div className="grid grid-cols-1 gap-8">
            {events.map((event, i) => (
              <div key={i} className="group bg-white rounded-[40px] overflow-hidden flex flex-col md:flex-row shadow-sm transition-all hover:scale-[1.01]">
                <div className="md:w-1/3 relative overflow-hidden">
                  <div className="absolute inset-0 bg-primary/40 z-10"></div>
                  <Image 
                    src="/media/Главный_план.jpg"
                    alt={event.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-6 left-6 z-20 bg-white rounded-2xl p-4 text-center min-w-[80px]">
                    <div className="text-2xl font-extrabold text-primary leading-none">{format(new Date(event.date), 'd')}</div>
                    <div className="text-[10px] font-bold text-primary uppercase tracking-widest mt-1">{format(new Date(event.date), 'MMM', { locale: ru })}</div>
                  </div>
                </div>
                
                <div className="md:w-2/3 p-8 md:p-12 flex flex-col">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 text-text-secondary text-xs font-bold uppercase tracking-widest">
                        <Clock size={16} className="text-primary" />
                        {format(new Date(event.date), 'HH:mm')}
                      </div>
                      <div className="flex items-center gap-2 text-text-secondary text-xs font-bold uppercase tracking-widest">
                        <MapPin size={16} className="text-primary" />
                        Бирск
                      </div>
                    </div>
                    <button className="text-text-secondary hover:text-primary transition-colors">
                      <Share2 size={20} />
                    </button>
                  </div>

                  <h3 className="text-2xl font-extrabold mb-4 text-text-primary">{event.title}</h3>
                  <p className="text-text-secondary font-medium text-sm leading-relaxed mb-8 line-clamp-3">
                    {event.description}
                  </p>
                  
                  <div className="mt-auto pt-6 border-t border-slate-100 flex justify-between items-center">
                    <span className="text-[10px] text-text-secondary font-bold uppercase tracking-widest">Мест ограничено</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-[40px] text-center py-32 shadow-sm">
            <Calendar size={64} className="mx-auto text-slate-200 mb-6" />
            <p className="text-text-secondary font-bold text-xl">Пока нет запланированных событий.</p>
            <p className="text-text-secondary/60 text-sm mt-2">Следите за обновлениями в наших соцсетях!</p>
          </div>
        )}
      </div>
    </div>
  );
}
