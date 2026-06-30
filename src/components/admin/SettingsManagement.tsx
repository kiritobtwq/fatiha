'use client';

import { useState, useEffect } from 'react';
import { Save, ExternalLink, BarChart3 } from 'lucide-react';

export default function SettingsManagement() {
  const [yandexMetrikaId, setYandexMetrikaId] = useState('');
  const [googleAnalyticsId, setGoogleAnalyticsId] = useState('');
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/settings')
      .then(res => res.json())
      .then(data => {
        setYandexMetrikaId(data.yandexMetrikaId || '');
        setGoogleAnalyticsId(data.googleAnalyticsId || '');
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    await fetch('/api/admin/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ yandexMetrikaId, googleAnalyticsId }),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pt-20">
      <h1 className="font-display font-bold text-3xl text-slate-800">Настройки сайта</h1>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-xl text-slate-800">Аналитика</h2>
          <div className="flex gap-2">
            {yandexMetrikaId && (
              <a
                href={`https://metrika.yandex.ru/stat/summary?id=${yandexMetrikaId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-4 py-2 bg-primary/10 text-primary rounded-lg text-xs font-bold hover:bg-primary/20 transition-colors"
              >
                <BarChart3 size={14} /> Метрика
              </a>
            )}
            {googleAnalyticsId && (
              <a
                href="https://analytics.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold hover:bg-blue-100 transition-colors"
              >
                <BarChart3 size={14} /> Analytics
              </a>
            )}
          </div>
        </div>

        {loading ? (
          <p className="text-slate-400 text-sm">Загрузка...</p>
        ) : (
          <>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Яндекс.Метрика ID</label>
              <input
                type="text"
                value={yandexMetrikaId}
                onChange={(e) => setYandexMetrikaId(e.target.value)}
                placeholder="Например: 98765432"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary font-mono"
              />
              <p className="text-xs text-slate-400 mt-1">
                Получите ID в <a href="https://metrika.yandex.ru" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-1">Яндекс.Метрике <ExternalLink size={10} /></a>
              </p>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Google Analytics ID</label>
              <input
                type="text"
                value={googleAnalyticsId}
                onChange={(e) => setGoogleAnalyticsId(e.target.value)}
                placeholder="Например: G-XXXXXXXXXX"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary font-mono"
              />
              <p className="text-xs text-slate-400 mt-1">
                Получите ID в <a href="https://analytics.google.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-1">Google Analytics <ExternalLink size={10} /></a>
              </p>
            </div>
          </>
        )}
      </div>

      <button
        onClick={handleSave}
        className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary-dark transition-colors"
      >
        <Save size={18} />
        {saved ? 'Сохранено!' : 'Сохранить настройки'}
      </button>
    </div>
  );
}
