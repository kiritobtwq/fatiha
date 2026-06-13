'use client';

import { useState } from 'react';
import { Briefcase, Plus, Trash2, Edit, X } from 'lucide-react';

interface Service {
  id: number;
  title: string;
  description: string;
  imageUrl: string | null;
  createdAt: string;
}

interface Props {
  services: Service[];
  setServices: (services: Service[]) => void;
  loadData: () => void;
}

export default function ServicesManagement({ services, setServices, loadData }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState({ title: '', description: '', imageUrl: '' });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setFormData({ title: '', description: '', imageUrl: '' });
        setIsEditing(false);
        loadData();
      }
    } catch (error) {
      console.error('Error creating service:', error);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;

    try {
      const res = await fetch('/api/admin/services', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, id: editingService.id }),
      });

      if (res.ok) {
        setEditingService(null);
        setIsEditing(false);
        setFormData({ title: '', description: '', imageUrl: '' });
        loadData();
      }
    } catch (error) {
      console.error('Error updating service:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Удалить услугу?')) return;

    try {
      const res = await fetch(`/api/admin/services?id=${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        loadData();
      }
    } catch (error) {
      console.error('Error deleting service:', error);
    }
  };

  const startEdit = (service: Service) => {
    setEditingService(service);
    setFormData({
      title: service.title,
      description: service.description,
      imageUrl: service.imageUrl || '',
    });
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setEditingService(null);
    setIsEditing(false);
    setFormData({ title: '', description: '', imageUrl: '' });
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <h1 className="font-display font-bold text-3xl text-slate-800">Услуги</h1>
        <button
          onClick={() => setIsEditing(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl font-bold hover:bg-primary-dark transition-colors"
        >
          <Plus size={18} />
          Добавить услугу
        </button>
      </div>

      {isEditing && (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold text-xl text-slate-800">
              {editingService ? 'Редактировать услугу' : 'Новая услуга'}
            </h2>
            <button onClick={cancelEdit} className="text-slate-400 hover:text-slate-600">
              <X size={24} />
            </button>
          </div>

          <form onSubmit={editingService ? handleUpdate : handleCreate} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Название</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Описание</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary h-32 resize-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">URL изображения (необязательно)</label>
              <input
                type="url"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary-dark transition-colors"
              >
                {editingService ? 'Сохранить изменения' : 'Создать услугу'}
              </button>
              <button
                type="button"
                onClick={cancelEdit}
                className="px-6 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-colors"
              >
                Отмена
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.isArray(services) && services.length > 0 ? services.map((service) => (
          <div key={service.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
            {service.imageUrl && (
              <div className="aspect-video rounded-xl overflow-hidden bg-slate-100">
                <img src={service.imageUrl} alt={service.title} className="w-full h-full object-cover" />
              </div>
            )}
            <div>
              <h3 className="font-bold text-lg text-slate-800">{service.title}</h3>
              <p className="text-sm text-slate-600 mt-2 line-clamp-3">{service.description}</p>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => startEdit(service)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-colors"
              >
                <Edit size={16} />
                Редактировать
              </button>
              <button
                onClick={() => handleDelete(service.id)}
                className="px-4 py-2 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-100 transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        )) : (
          <div className="col-span-full text-center py-12">
            <p className="text-slate-500">Нет услуг. Нажмите "Добавить услугу" чтобы создать первую услугу.</p>
          </div>
        )}
      </div>
    </div>
  );
}
