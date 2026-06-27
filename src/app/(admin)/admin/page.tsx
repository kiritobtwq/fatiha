'use client';

import { useEffect, useState } from 'react';
import {
  LayoutDashboard,
  Users,
  Calendar,
  BookOpen,
  Briefcase,
  MessagesSquare,
  LogOut,
  CheckCircle2,
  XCircle,
  Clock,
  Settings,
  ImageIcon,
  ExternalLink,
} from 'lucide-react';
import ScheduleManagement from '@/components/admin/ScheduleManagement';
import ServicesManagement from '@/components/admin/ServicesManagement';
import LessonsManagement from '@/components/admin/LessonsManagement';
import EventsManagement from '@/components/admin/EventsManagement';
import GalleryManagement from '@/components/admin/GalleryManagement';
import SettingsManagement from '@/components/admin/SettingsManagement';

interface Stats {
  totalRaised: number;
  donorCount: number;
  donationCount: number;
  contactRequestCount: number;
}

interface Donation {
  id: number;
  amount: number;
  donorName: string;
  donorEmail: string;
  phone?: string | null;
  status: string;
  isRecurring?: boolean;
  recurringPeriod?: string | null;
  createdAt: string;
}

interface ContactRequest {
  id: string;
  name: string;
  contact: string;
  subject: string;
  message: string;
  createdAt: string;
}

interface Service {
  id: number;
  title: string;
  description: string;
  imageUrl: string | null;
  createdAt: string;
}

interface Lesson {
  id: number;
  title: string;
  group: string;
  days: string[];
  startTime: string;
  endTime: string;
  createdAt: string;
}

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  createdAt: string;
}

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState<Stats | null>(null);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [contacts, setContacts] = useState<ContactRequest[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [gallery, setGallery] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const opts = { credentials: 'include' as const };
      const [statsRes, donationsRes, contactsRes, servicesRes, lessonsRes, eventsRes, galleryRes] = await Promise.all([
        fetch('/api/stats', opts),
        fetch('/api/donations?limit=50&offset=0', opts),
        fetch('/api/contact', opts),
        fetch('/api/admin/services', opts),
        fetch('/api/admin/lessons', opts),
        fetch('/api/events', opts),
        fetch('/api/admin/gallery', opts),
      ]);

      const statsData = await statsRes.json();
      const donationsData = await donationsRes.json();
      const contactsData = await contactsRes.json();
      const servicesData = await servicesRes.json();
      const lessonsData = await lessonsRes.json();
      const eventsData = await eventsRes.json();
      const galleryData = await galleryRes.json();

      setStats({
        totalRaised: statsData.totalRaised || 0,
        donorCount: statsData.donorCount || 0,
        donationCount: donationsData.totalCount || 0,
        contactRequestCount: contactsData.count || 0,
      });

      setDonations(Array.isArray(donationsData.donations) ? donationsData.donations : []);
      setContacts(Array.isArray(contactsData.requests) ? contactsData.requests : []);
      setServices(Array.isArray(servicesData) ? servicesData : []);
      setLessons(Array.isArray(lessonsData) ? lessonsData : []);
      setEvents(Array.isArray(eventsData) ? eventsData : []);
      setGallery(Array.isArray(galleryData) ? galleryData : []);
    } catch (error) {
      console.error('Error loading admin data:', error);
      setServices([]);
      setLessons([]);
      setEvents([]);
      setGallery([]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('ru-RU').format(num);
  };

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    window.location.href = '/alfatiha-admin-portal-9k2x4/login';
  };

  const handleDeleteContact = async (id: string) => {
    if (!confirm('Удалить заявку?')) return;
    try {
      const res = await fetch(`/api/admin/contacts?id=${id}`, { method: 'DELETE', credentials: 'include' });
      const data = await res.json();
      if (res.ok) {
        loadData();
      } else {
        alert(data.error || 'Ошибка при удалении заявки');
      }
    } catch (error) {
      console.error('Error deleting contact:', error);
      alert('Ошибка при удалении заявки');
    }
  };

  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Дашборд' },
    { id: 'donations', icon: Users, label: 'Пожертвования' },
    { id: 'schedule', icon: Calendar, label: 'Расписание намазов' },
    { id: 'education', icon: BookOpen, label: 'Расписание уроков' },
    { id: 'services', icon: Briefcase, label: 'Услуги' },
    { id: 'events', icon: Calendar, label: 'События' },
    { id: 'gallery', icon: ImageIcon, label: 'Галерея' },
    { id: 'contacts', icon: MessagesSquare, label: 'Заявки' },
    { id: 'settings', icon: Settings, label: 'Настройки' },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Mobile horizontal nav */}
      <div className="lg:hidden sticky top-6 z-30 bg-white border-b border-slate-200">
        <div className="relative">
          <div className="flex items-center gap-1 px-3 py-2 overflow-x-auto no-scrollbar">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all shrink-0 ${
                activeTab === item.id
                  ? 'bg-primary text-white shadow-md shadow-primary/20'
                  : 'text-slate-400'
              }`}
              >
                <item.icon size={16} />
                {item.label}
              </button>
            ))}
            <button
              onClick={() => window.location.href = '/'}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold text-slate-400 whitespace-nowrap shrink-0"
            >
              <ExternalLink size={16} /> Сайт
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold text-red-400 whitespace-nowrap shrink-0"
            >
              <LogOut size={16} /> Выйти
            </button>
          </div>
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none flex items-center justify-end pr-1 lg:hidden">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-300 animate-pulse"><path d="M9 18l6-6-6-6"/></svg>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-4 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 lg:gap-8">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 sticky top-24">
              <div className="flex items-center gap-3 mb-8 px-2">
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white font-bold text-xl">
                  А
                </div>
                <h2 className="font-display font-bold text-xl text-slate-800">Админ</h2>
              </div>

              <nav className="space-y-1 mb-8">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                      activeTab === item.id
                        ? 'bg-primary text-white shadow-md shadow-primary/20'
                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                    }`}
                  >
                    <item.icon size={18} />
                    {item.label}
                  </button>
                ))}
              </nav>

              <button
                onClick={() => window.location.href = '/'}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-colors w-full"
              >
                <ExternalLink size={18} />
                Вернуться на сайт
              </button>

              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 transition-colors w-full"
              >
                <LogOut size={18} />
                Выйти
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-4 space-y-8">
            {activeTab === 'dashboard' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pt-20">
                <div className="flex items-center justify-between">
                  <h1 className="font-display font-bold text-2xl lg:text-3xl text-slate-800">Обзор</h1>
                  <button onClick={loadData} className="text-sm font-bold text-primary hover:underline">
                    Обновить
                  </button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
                  {[
                    { label: 'Всего собрано', value: `${formatNumber(Math.floor(stats?.totalRaised || 0))} ₽`, color: 'text-primary' },
                    { label: 'Жертвователей', value: formatNumber(stats?.donorCount || 0), color: 'text-blue-600' },
                    { label: 'Пожертвований', value: formatNumber(stats?.donationCount || 0), color: 'text-indigo-600' },
                    { label: 'Заявок на связь', value: formatNumber(stats?.contactRequestCount || 0), color: 'text-emerald-600' },
                  ].map((stat, i) => (
                    <div key={i} className="bg-white p-4 lg:p-6 rounded-2xl shadow-sm border border-slate-200">
                      <div className={`text-xl lg:text-2xl font-black mb-1 ${stat.color}`}>{isLoading ? '...' : stat.value}</div>
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">{stat.label}</div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                  {/* Recent Donations Preview */}
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                      <h3 className="font-bold text-slate-800">Последние пожертвования</h3>
                      <button onClick={() => setActiveTab('donations')} className="text-xs font-bold text-primary hover:underline">Все</button>
                    </div>
                    <div className="divide-y divide-slate-50">
                      {donations.slice(0, 5).map((donation) => (
                        <div key={donation.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold">
                              {donation.donorName[0]}
                            </div>
                            <div>
                              <div className="text-sm font-bold text-slate-700">{donation.donorName}</div>
                              <div className="text-xs text-slate-400">{new Date(donation.createdAt).toLocaleDateString()}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-black text-primary">+{formatNumber(donation.amount)} ₽</div>
                            <div className="text-[10px] font-bold text-emerald-500 uppercase">Успешно</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recent Contacts Preview */}
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                      <h3 className="font-bold text-slate-800">Новые заявки</h3>
                      <button onClick={() => setActiveTab('contacts')} className="text-xs font-bold text-primary hover:underline">Все</button>
                    </div>
                    <div className="divide-y divide-slate-50">
                      {contacts.slice(0, 5).map((request) => (
                        <div key={request.id} className="p-4 flex items-center gap-4 hover:bg-slate-50 transition-colors">
                          <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-500">
                            <MessagesSquare size={20} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-bold text-slate-700 truncate">{request.name}</div>
                            <div className="text-xs text-slate-400 truncate">{request.subject || 'Без темы'}</div>
                          </div>
                          <div className="text-xs font-bold text-slate-400">
                            {new Date(request.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'donations' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pt-20">
                <div className="flex items-center justify-between">
                  <h1 className="font-display font-bold text-2xl lg:text-3xl text-slate-800">Пожертвования</h1>
                </div>

                {/* Desktop table */}
                <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100">
                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Имя</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Телефон</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Сумма</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Тип</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Дата</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Статус</th>
                        <th className="px-6 py-4"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {donations.map((donation) => (
                        <tr key={donation.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4 font-bold text-slate-700">{donation.donorName}</td>
                          <td className="px-6 py-4 text-sm text-slate-500">{donation.phone || '—'}</td>
                          <td className="px-6 py-4 font-black text-primary">{formatNumber(donation.amount)} ₽</td>
                          <td className="px-6 py-4">
                            {donation.isRecurring ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-50 text-purple-600">
                                Подписка
                              </span>
                            ) : (
                              <span className="text-xs text-slate-400">Разово</span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-500">{new Date(donation.createdAt).toLocaleDateString()}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                              donation.status === 'succeeded'
                                ? 'bg-emerald-50 text-emerald-600'
                                : donation.status === 'pending'
                                ? 'bg-amber-50 text-amber-600'
                                : 'bg-red-50 text-red-600'
                            }`}>
                              {donation.status === 'succeeded' && <CheckCircle2 size={12} />}
                              {donation.status === 'pending' && <Clock size={12} />}
                              {donation.status === 'canceled' && <XCircle size={12} />}
                              {donation.status === 'succeeded' ? 'Успешно' : donation.status === 'pending' ? 'Ожидание' : 'Отменено'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button onClick={async () => { if (!confirm('Удалить пожертвование?')) return; await fetch(`/api/admin/donations?id=${donation.id}`, { method: 'DELETE', credentials: 'include' }); loadData(); }} className="text-red-300 hover:text-red-500 text-sm font-bold">Удалить</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile cards */}
                <div className="md:hidden space-y-3">
                  {donations.map((donation) => (
                    <div key={donation.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-700">{donation.donorName}</span>
                          {donation.isRecurring && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-purple-50 text-purple-600">Подписка</span>
                          )}
                        </div>
                        <span className="font-black text-primary">{formatNumber(donation.amount)} ₽</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                        <span>{new Date(donation.createdAt).toLocaleDateString()}</span>
                        {donation.phone && <span>• {donation.phone}</span>}
                        <span className={`ml-auto inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                          donation.status === 'succeeded' ? 'bg-emerald-50 text-emerald-600'
                          : donation.status === 'pending' ? 'bg-amber-50 text-amber-600'
                          : 'bg-red-50 text-red-600'
                        }`}>
                          {donation.status === 'succeeded' ? 'Успешно' : donation.status === 'pending' ? 'Ожидание' : 'Отменено'}
                        </span>
                        <button onClick={async () => { if (!confirm('Удалить?')) return; await fetch(`/api/admin/donations?id=${donation.id}`, { method: 'DELETE', credentials: 'include' }); loadData(); }} className="text-red-300 hover:text-red-500 text-xs font-bold">Удалить</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'contacts' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pt-20">
                <h1 className="font-display font-bold text-2xl lg:text-3xl text-slate-800">Заявки</h1>
                <div className="grid grid-cols-1 gap-4">
                  {contacts.map((request) => (
                    <div key={request.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-500 font-bold text-xl">
                            {request.name[0]}
                          </div>
                          <div>
                            <h3 className="font-bold text-slate-800 text-lg">{request.name}</h3>
                            <div className="text-sm text-slate-400 font-medium">{request.contact}</div>
                          </div>
                        </div>
                        <div className="text-xs font-bold text-slate-400 flex items-center gap-1">
                          <Clock size={14} /> {new Date(request.createdAt).toLocaleString('ru-RU')}
                        </div>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">{request.subject || 'Сообщение'}</div>
                        <p className="text-slate-600 leading-relaxed">{request.message}</p>
                      </div>
                      <div className="flex flex-wrap gap-2 pt-2">
                        <a 
                          href={`mailto:${request.contact}?subject=Re: ${request.subject || 'Сообщение'}`}
                          className="px-4 py-2 bg-primary !text-white text-sm font-bold rounded-lg hover:bg-primary-dark transition-colors"
                        >
                          Ответить
                        </a>
                        <button 
                          onClick={() => handleDeleteContact(request.id)}
                          className="px-4 py-2 bg-red-50 text-red-600 text-sm font-bold rounded-lg hover:bg-red-100 transition-colors"
                        >
                          Удалить
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'schedule' && (
              <ScheduleManagement />
            )}

            {activeTab === 'services' && (
              <ServicesManagement services={services} setServices={setServices} loadData={loadData} />
            )}

            {activeTab === 'education' && (
              <LessonsManagement lessons={lessons} setLessons={setLessons} loadData={loadData} />
            )}

            {activeTab === 'events' && (
              <EventsManagement events={events} setEvents={setEvents} loadData={loadData} />
            )}

            {activeTab === 'gallery' && (
              <GalleryManagement gallery={gallery} setGallery={setGallery} loadData={loadData} />
            )}

            {activeTab === 'settings' && (
              <SettingsManagement />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
