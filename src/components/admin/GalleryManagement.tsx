'use client';

import { useState } from 'react';
import { Image as ImageIcon, Plus, Trash2, X, Upload } from 'lucide-react';

interface GalleryImage {
  id: number;
  url: string;
  description: string | null;
  createdAt: string;
}

interface Props {
  gallery: GalleryImage[];
  setGallery: (gallery: GalleryImage[]) => void;
  loadData: () => void;
}

export default function GalleryManagement({ gallery, setGallery, loadData }: Props) {
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({ url: '', description: '' });
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: uploadFormData,
      });

      const data = await res.json();
      if (res.ok) {
        setFormData({ ...formData, url: data.url });
      } else {
        alert(data.error || 'Ошибка загрузки изображения');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Ошибка загрузки изображения');
    } finally {
      setIsUploading(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setFormData({ url: '', description: '' });
        setIsAdding(false);
        loadData();
      }
    } catch (error) {
      console.error('Error adding image:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Удалить изображение?')) return;

    try {
      const res = await fetch(`/api/admin/gallery?id=${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        loadData();
      }
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <h1 className="font-display font-bold text-3xl text-slate-800">Галерея</h1>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl font-bold hover:bg-primary-dark transition-colors"
        >
          <Plus size={18} />
          Добавить изображение
        </button>
      </div>

      {isAdding && (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold text-xl text-slate-800">Новое изображение</h2>
            <button onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-slate-600">
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleAdd} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Загрузить изображение</label>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 px-4 py-3 bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-primary transition-colors">
                    <Upload size={20} className="text-slate-400" />
                    <span className="text-sm text-slate-600">Выбрать файл</span>
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                  {isUploading && <span className="text-sm text-slate-500">Загрузка...</span>}
                </div>
                <div className="text-center text-sm text-slate-400">или</div>
                <input
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary"
                  placeholder="Вставить URL изображения"
                  required
                />
              </div>
              {formData.url && (
                <div className="mt-3">
                  <img
                    src={formData.url}
                    alt="Предпросмотр"
                    className="max-h-48 rounded-lg object-cover mx-auto"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Описание (необязательно)</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary h-24 resize-none"
                placeholder="Описание изображения"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary-dark transition-colors"
              >
                Добавить
              </button>
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-6 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-colors"
              >
                Отмена
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.isArray(gallery) && gallery.length > 0 ? gallery.map((image) => (
          <div key={image.id} className="group relative bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="aspect-square">
              <img
                src={image.url}
                alt={image.description || 'Изображение галереи'}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button
                onClick={() => handleDelete(image.id)}
                className="p-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
              >
                <Trash2 size={20} />
              </button>
            </div>
            {image.description && (
              <div className="p-3">
                <p className="text-xs text-slate-600 line-clamp-2">{image.description}</p>
              </div>
            )}
          </div>
        )) : (
          <div className="col-span-full text-center py-12">
            <p className="text-slate-500">Нет изображений. Нажмите "Добавить изображение" чтобы загрузить первое изображение.</p>
          </div>
        )}
      </div>
    </div>
  );
}
