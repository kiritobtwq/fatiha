'use client';

import { useState } from 'react';
import { Calendar, Plus, Trash2, Edit, X, Upload } from 'lucide-react';

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  imageUrl?: string | null;
  createdAt: string;
}

interface Props {
  events: Event[];
  setEvents: (events: Event[]) => void;
  loadData: () => void;
}

export default function EventsManagement({ events, setEvents, loadData }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState({ title: '', description: '', date: '', imageUrl: '' });
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (res.ok) setFormData(prev => ({ ...prev, imageUrl: data.url }));
      else alert(data.error || 'Ошибка загрузки');
    } catch { alert('Ошибка загрузки'); }
    finally { setIsUploading(false); }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setFormData({ title: '', description: '', date: '', imageUrl: '' });
        setIsEditing(false);
        loadData();
      }
    } catch (error) { console.error('Error creating event:', error); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Удалить событие?')) return;
    try {
      const res = await fetch(`/api/admin/events?id=${id}`, { method: 'DELETE' });
      if (res.ok) loadData();
    } catch (error) { console.error('Error deleting event:', error); }
  };

  const startEdit = (event: Event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      date: event.date.split('T')[0],
      imageUrl: event.imageUrl || '',
    });
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setEditingEvent(null);
    setIsEditing(false);
    setFormData({ title: '', description: '', date: '', imageUrl: '' });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent) return;
    try {
      const res = await fetch('/api/admin/events', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, id: editingEvent.id }),
      });
      if (res.ok) { setEditingEvent(null); setIsEditing(false); setFormData({ title: '', description: '', date: '', imageUrl: '' }); loadData(); }
    } catch (error) { console.error('Error updating event:', error); }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <h1 className="font-display font-bold text-3xl text-slate-800">События</h1>
        <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl font-bold hover:bg-primary-dark transition-colors">
          <Plus size={18} /> Добавить событие
        </button>
      </div>

      {isEditing && (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold text-xl text-slate-800">{editingEvent ? 'Редактировать событие' : 'Новое событие'}</h2>
            <button onClick={cancelEdit} className="text-slate-400 hover:text-slate-600"><X size={24} /></button>
          </div>

          <form onSubmit={editingEvent ? handleUpdate : handleCreate} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Название</label>
              <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary" required />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Описание</label>
              <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary h-32 resize-none" required />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Дата</label>
              <input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary" required />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Фото события</label>
              <div className="space-y-3">
                <label className="flex items-center gap-2 px-4 py-3 bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-primary transition-colors">
                  <Upload size={20} className="text-slate-400" />
                  <span className="text-sm text-slate-600">{isUploading ? 'Загрузка...' : 'Загрузить файл'}</span>
                  <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                </label>
                <div className="text-center text-sm text-slate-400">или</div>
                <input type="text" value={formData.imageUrl} onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary" placeholder="URL изображения" />
              </div>
              {formData.imageUrl && <img src={formData.imageUrl} alt="Превью" className="mt-3 max-h-40 rounded-lg object-cover" />}
            </div>

            <div className="flex gap-3">
              <button type="submit" className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary-dark transition-colors">
                {editingEvent ? 'Сохранить' : 'Создать'}
              </button>
              <button type="button" onClick={cancelEdit} className="px-6 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-colors">Отмена</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <div key={event.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            {event.imageUrl && <div className="aspect-video relative"><img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover" /></div>}
            <div className="p-6 space-y-3">
              <h3 className="font-bold text-lg text-slate-800">{event.title}</h3>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Calendar size={16} /> {new Date(event.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
              <p className="text-sm text-slate-600 line-clamp-3">{event.description}</p>
              <div className="flex gap-2 pt-2">
                <button onClick={() => startEdit(event)} className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-colors">
                  <Edit size={16} /> Редактировать
                </button>
                <button onClick={() => handleDelete(event.id)} className="px-4 py-2 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-100 transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
