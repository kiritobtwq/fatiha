'use client';

import { useState } from 'react';
import { Save, ExternalLink, BarChart3, Lock, Eye, EyeOff } from 'lucide-react';

interface Settings {
  yandexMetrikaId: string;
  googleAnalyticsId: string;
}

export default function SettingsManagement() {
  const [settings, setSettings] = useState<Settings>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('site_settings');
      return stored ? JSON.parse(stored) : { yandexMetrikaId: '', googleAnalyticsId: '' };
    }
    return { yandexMetrikaId: '', googleAnalyticsId: '' };
  });
  const [saved, setSaved] = useState(false);

  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [showPasswords, setShowPasswords] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handleSave = () => {
    localStorage.setItem('site_settings', JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleChangePassword = async () => {
    setPasswordError('');
    setPasswordSuccess('');

    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setPasswordError('Заполните все поля');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('Новые пароли не совпадают');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setPasswordError('Новый пароль должен быть минимум 8 символов');
      return;
    }

    setIsChangingPassword(true);
    try {
      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setPasswordSuccess('Пароль успешно изменён');
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        setPasswordError(data.error || 'Ошибка');
      }
    } catch {
      setPasswordError('Ошибка соединения');
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pt-20">
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

      {/* Password change */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 space-y-6">
        <h2 className="font-bold text-xl text-slate-800 flex items-center gap-2">
          <Lock size={20} /> Сменить пароль
        </h2>

        {passwordError && (
          <div className="p-4 bg-red-50 text-red-600 text-sm font-bold rounded-xl">{passwordError}</div>
        )}
        {passwordSuccess && (
          <div className="p-4 bg-emerald-50 text-emerald-600 text-sm font-bold rounded-xl">{passwordSuccess}</div>
        )}

        <div className="space-y-4 max-w-md">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Текущий пароль</label>
            <div className="relative">
              <input
                type={showPasswords ? 'text' : 'password'}
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary pr-12"
              />
              <button type="button" onClick={() => setShowPasswords(!showPasswords)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                {showPasswords ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Новый пароль</label>
            <input
              type={showPasswords ? 'text' : 'password'}
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary"
              placeholder="Минимум 8 символов"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Подтвердите новый пароль</label>
            <input
              type={showPasswords ? 'text' : 'password'}
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary"
            />
          </div>
          <button
            onClick={handleChangePassword}
            disabled={isChangingPassword}
            className="flex items-center gap-2 px-6 py-3 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-700 transition-colors disabled:opacity-50"
          >
            <Lock size={18} />
            {isChangingPassword ? 'Смена...' : 'Сменить пароль'}
          </button>
        </div>
      </div>
    </div>
  );
}
