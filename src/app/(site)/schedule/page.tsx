'use client';

import { useState, useEffect } from 'react';
import { format, addDays, isToday } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Calendar as CalendarIcon } from 'lucide-react';

const DEFAULT_TIMES = {
  fajr: '04:30',
  dhuhr: '13:00',
  asr: '17:00',
  maghrib: '21:00',
  isha: '22:30',
};

const PRAYERS = [
  { key: 'fajr', name: 'Фаджр' },
  { key: 'dhuhr', name: 'Зухр' },
  { key: 'asr', name: 'Аср' },
  { key: 'maghrib', name: 'Магриб' },
  { key: 'isha', name: 'Иша' },
];

export default function SchedulePage() {
  const [schedules, setSchedules] = useState<any[]>([]);

  const days = [new Date(), addDays(new Date(), 1), addDays(new Date(), 2)];

  useEffect(() => {
    fetch('/api/schedule')
      .then(res => res.json())
      .then(data => {
        if (data && !data.error) setSchedules([data]);
      });
  }, []);

  const getSchedule = (day: Date) => {
    const found = schedules.find(s => format(new Date(s.date), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd'));
    return {
      fajr: found?.fajr || DEFAULT_TIMES.fajr,
      dhuhr: found?.dhuhr || DEFAULT_TIMES.dhuhr,
      asr: found?.asr || DEFAULT_TIMES.asr,
      maghrib: found?.maghrib || DEFAULT_TIMES.maghrib,
      isha: found?.isha || DEFAULT_TIMES.isha,
    };
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-extrabold text-text-primary">Расписание намазов</h1>
          <p className="text-text-secondary font-medium text-sm mt-1">Ближайшие 3 дня</p>
        </div>

        <div className="space-y-4">
          {days.map((day, i) => {
            const s = getSchedule(day);
            const today = isToday(day);
            return (
              <div key={i} className={`bg-white rounded-2xl p-5 shadow-sm ${today ? 'ring-2 ring-primary' : ''}`}>
                <div className="flex items-center gap-3 mb-4">
                  {today && <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>}
                  <div>
                    <div className={`font-extrabold text-lg ${today ? 'text-primary' : 'text-text-primary'}`}>
                      {today ? 'Сегодня' : format(day, 'd MMMM, EEEE', { locale: ru })}
                    </div>
                    <div className="text-xs text-text-secondary">{format(day, 'd MMMM yyyy', { locale: ru })}</div>
                  </div>
                </div>

                <div className="grid grid-cols-5 gap-3">
                  {PRAYERS.map((prayer) => (
                    <div key={prayer.key} className="bg-[#F2F2F7] rounded-xl p-3 text-center">
                      <div className="text-[9px] text-[#8E8E93] font-bold uppercase tracking-wider mb-1">{prayer.name}</div>
                      <div className="text-sm font-mono font-bold text-text-primary">{(s as any)[prayer.key]}</div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 bg-white p-5 rounded-2xl shadow-sm flex items-start gap-4">
          <CalendarIcon size={20} className="text-primary shrink-0 mt-0.5" />
          <p className="text-text-secondary text-xs font-medium leading-relaxed">
            Время намазов по умолчанию. Коллективные намазы начинаются через 15-20 мин после наступления времени. Джума — 13:00.
          </p>
        </div>
      </div>
    </div>
  );
}
