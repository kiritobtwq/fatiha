'use client';

import { useState, useEffect } from 'react';
import { Save, ExternalLink, BarChart3 } from 'lucide-react';

interface Settings {
  yandexMetrikaId: string;
  googleAnalyticsId: string;
}

export default function SettingsManagement() {
  const [settings, setSettings] = useState<Settings>({
    yandexMetrikaId: '',
    googleAnalyticsId: '',
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('site_settings');
    if (stored) setSettings(JSON.parse(stored));
  }, []);

  const handleSave = () => {
    localStorage.setItem('site_settings', JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h1 className="font-display font-bold text-3xl text-slate-800">Настройки сайта</h1>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-xl text-slate-800">Аналитика</h2>
          <div className="flex gap-2">
            {settings.yandexMetrikaId && (
              <a
                href={`https://metrika.yandex.ru/stat/summary?id=${settings.yandexMetrikaId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-4 py-2 bg-primary/10 text-primary rounded-lg text-xs font-bold hover:bg-primary/20 transition-colors"
              >
                <BarChart3 size={14} /> Метрика
              </a>
            )}
            {settings.googleAnalyticsId && (
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

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Яндекс.Метрика ID</label>
          <input
            type="text"
            value={settings.yandexMetrikaId}
            onChange={(e) => setSettings({ ...settings, yandexMetrikaId: e.target.value })}
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
            value={settings.googleAnalyticsId}
            onChange={(e) => setSettings({ ...settings, googleAnalyticsId: e.target.value })}
            placeholder="Например: G-XXXXXXXXXX"
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary font-mono"
          />
          <p className="text-xs text-slate-400 mt-1">
            Получите ID в <a href="https://analytics.google.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-1">Google Analytics <ExternalLink size={10} /></a>
          </p>
        </div>
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
