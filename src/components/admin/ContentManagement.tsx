'use client';

import { useState } from 'react';
import { FileText, Plus, Trash2, Edit, X, Image as ImageIcon, Upload } from 'lucide-react';

interface Content {
  id: string;
  key: string;
  value: string;
  imageUrl: string | null;
  updatedAt: string;
}

interface Props {
  content: Content[];
  setContent: (content: Content[]) => void;
  loadData: () => void;
}

const PREDEFINED_KEYS = [
  { key: 'hero_title', label: 'Заголовок главного баннера' },
  { key: 'hero_subtitle', label: 'Подзаголовок главного баннера' },
  { key: 'about_title', label: 'Заголовок "О нас"' },
  { key: 'about_text', label: 'Текст "О нас"' },
  { key: 'contact_title', label: 'Заголовок контактов' },
  { key: 'footer_text', label: 'Текст подвала' },
  { key: 'custom', label: 'Свой ключ (ввести вручную)' },
];

export default function ContentManagement({ content, setContent, loadData }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [editingContent, setEditingContent] = useState<Content | null>(null);
  const [formData, setFormData] = useState({
    key: '',
    value: '',
    imageUrl: '',
  });
  const [isUploading, setIsUploading] = useState(false);
  const [selectedKey, setSelectedKey] = useState('custom');

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        credentials: 'include',
        body: uploadFormData,
      });

      const data = await res.json();
      if (res.ok) {
        setFormData({ ...formData, imageUrl: data.url });
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

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        setFormData({ key: '', value: '', imageUrl: '' });
        setSelectedKey('custom');
        setIsEditing(false);
        loadData();
      } else {
        alert(data.error || 'Ошибка создания контента');
      }
    } catch (error) {
      console.error('Error creating content:', error);
      alert('Ошибка соединения');
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingContent) return;

    try {
      const res = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ ...formData, id: editingContent.id }),
      });

      const data = await res.json();
      if (res.ok) {
        setEditingContent(null);
        setIsEditing(false);
        setFormData({ key: '', value: '', imageUrl: '' });
        setSelectedKey('custom');
        loadData();
      } else {
        alert(data.error || 'Ошибка обновления контента');
      }
    } catch (error) {
      console.error('Error updating content:', error);
      alert('Ошибка соединения');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить контент?')) return;

    try {
      const res = await fetch(`/api/admin/content?id=${id}`, {
        method: 'DELETE', credentials: 'include',
      });

      if (res.ok) {
        loadData();
      } else {
        alert('Ошибка удаления контента');
      }
    } catch (error) {
      console.error('Error deleting content:', error);
      alert('Ошибка соединения');
    }
  };

  const startEdit = (contentItem: Content) => {
    setEditingContent(contentItem);
    const matchingKey = PREDEFINED_KEYS.find(pk => pk.key === contentItem.key);
    setSelectedKey(matchingKey ? matchingKey.key : 'custom');
    setFormData({
      key: contentItem.key,
      value: contentItem.value,
      imageUrl: contentItem.imageUrl || '',
    });
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setEditingContent(null);
    setIsEditing(false);
    setFormData({ key: '', value: '', imageUrl: '' });
    setSelectedKey('custom');
  };

  const handleKeySelect = (key: string) => {
    setSelectedKey(key);
    if (key !== 'custom') {
      setFormData({ ...formData, key });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <h1 className="font-display font-bold text-3xl text-slate-800">Управление контентом</h1>
        <button
          onClick={() => setIsEditing(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl font-bold hover:bg-primary-dark transition-colors"
        >
          <Plus size={18} />
          Добавить контент
        </button>
      </div>

      {isEditing && (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold text-xl text-slate-800">
              {editingContent ? 'Редактировать контент' : 'Новый контент'}
            </h2>
            <button onClick={cancelEdit} className="text-slate-400 hover:text-slate-600">
              <X size={24} />
            </button>
          </div>

          <form onSubmit={editingContent ? handleUpdate : handleCreate} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Выберите тип контента</label>
              <select
                value={selectedKey}
                onChange={(e) => handleKeySelect(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary"
                disabled={!!editingContent}
              >
                {PREDEFINED_KEYS.map((pk) => (
                  <option key={pk.key} value={pk.key}>
                    {pk.label}
                  </option>
                ))}
              </select>
            </div>

            {selectedKey === 'custom' && (
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Ключ (идентификатор)</label>
                <input
                  type="text"
                  value={formData.key}
                  onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary"
                  placeholder="Например: hero_title"
                  required
                />
                <p className="text-xs text-slate-400 mt-1">Уникальный идентификатор для использования в коде</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Значение (текст)</label>
              <textarea
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary min-h-[150px]"
                placeholder="Текстовое содержимое"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Изображение</label>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 px-4 py-3 bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-primary transition-colors">
                    <Upload size={20} className="text-slate-400" />
                    <span className="text-sm text-slate-600">Загрузить файл</span>
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
                  type="text"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary"
                  placeholder="Вставить URL изображения"
                />
              </div>
              {formData.imageUrl && (
                <div className="mt-3">
                  <img
                    src={formData.imageUrl}
                    alt="Предпросмотр"
                    className="max-h-48 rounded-lg object-cover mx-auto"
                  />
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary-dark transition-colors"
              >
                {editingContent ? 'Сохранить изменения' : 'Создать контент'}
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

      <div className="grid grid-cols-1 gap-4">
        {Array.isArray(content) && content.length > 0 ? (
          content.map((item) => (
            <div key={item.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold">
                      {item.key}
                    </span>
                    {item.imageUrl && (
                      <span className="flex items-center gap-1 text-xs text-slate-400">
                        <ImageIcon size={12} /> Изображение
                      </span>
                    )}
                  </div>
                  <p className="text-slate-600 text-sm line-clamp-2">{item.value}</p>
                  {item.imageUrl && (
                    <img
                      src={item.imageUrl}
                      alt={item.key}
                      className="mt-3 max-h-32 rounded-lg object-cover"
                    />
                  )}
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => startEdit(item)}
                    className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
                    title="Редактировать"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                    title="Удалить"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="text-xs text-slate-400">
                Обновлено: {new Date(item.updatedAt).toLocaleString('ru-RU')}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-500">Нет контента. Нажмите "Добавить контент" чтобы создать первый элемент.</p>
          </div>
        )}
      </div>
    </div>
  );
}
