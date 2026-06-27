'use client';

import { useState } from 'react';
import { Save, RotateCcw } from 'lucide-react';

const DEFAULT_TIMES = [
  { label: 'Фаджр', key: 'fajr', value: '04:30' },
  { label: 'Зухр', key: 'dhuhr', value: '13:00' },
  { label: 'Аср', key: 'asr', value: '17:00' },
  { label: 'Магриб', key: 'maghrib', value: '21:00' },
  { label: 'Иша', key: 'isha', value: '22:30' },
  { label: 'Джума', key: 'juma', value: '13:00' },
];

export default function ScheduleManagement() {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [times, setTimes] = useState<Record<string, string>>(
    Object.fromEntries(DEFAULT_TIMES.map(d => [d.key, d.value]))
  );
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (key: string, value: string) => {
    setTimes(prev => ({ ...prev, [key]: value }));
  };

  const resetToDefaults = () => {
    setTimes(Object.fromEntries(DEFAULT_TIMES.map(d => [d.key, d.value])));
    setMessage('Времена сброшены к значениям по умолчанию');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage('');

    try {
      const res = await fetch('/api/admin/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ date, ...times }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage('Расписание сохранено');
      } else {
        setMessage(data.error || 'Ошибка сохранения');
      }
    } catch (error) {
      setMessage('Ошибка соединения');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pt-20">
      <div className="flex items-center justify-between">
        <h1 className="font-display font-bold text-3xl text-slate-800">Расписание намазов</h1>
        <button
          onClick={resetToDefaults}
          className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-500 hover:text-primary transition-colors"
        >
          <RotateCcw size={16} />
          Значения по умолчанию
        </button>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <form onSubmit={handleSave} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Дата</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {DEFAULT_TIMES.map((field) => (
              <div key={field.key}>
                <label className="block text-sm font-bold text-slate-700 mb-2">{field.label}</label>
                <div className="flex items-center gap-2">
                  <input
                    type="time"
                    value={times[field.key]}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                    className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary text-lg font-mono font-bold"
                    required
                  />
                  <span className="text-xs font-bold text-slate-400 uppercase">чч:мм</span>
                </div>
              </div>
            ))}
          </div>

          {message && (
            <div className={`p-4 rounded-xl text-sm font-bold ${
              message.includes('сохранено') || message.includes('сброшены') ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
            }`}>
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary-dark transition-colors disabled:opacity-50"
          >
            <Save size={18} />
            {isSaving ? 'Сохранение...' : 'Сохранить расписание'}
          </button>
        </form>
      </div>

      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
        <p className="text-sm text-slate-500 font-medium">
          Укажите расписание на конкретную дату. Времена по умолчанию отображаются на странице расписания для всех дат, для которых нет сохранённых данных.
        </p>
      </div>
    </div>
  );
}
