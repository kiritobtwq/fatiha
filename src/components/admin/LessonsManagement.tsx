'use client';

import { useState } from 'react';
import { BookOpen, Plus, Trash2, Edit, X } from 'lucide-react';

interface Lesson {
  id: number;
  title: string;
  group: string;
  days: string[];
  startTime: string;
  endTime: string;
  createdAt: string;
}

interface Props {
  lessons: Lesson[];
  setLessons: (lessons: Lesson[]) => void;
  loadData: () => void;
}

const DAYS_OPTIONS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
const GROUP_OPTIONS = ['Общая детская', 'Мужская', 'Женская'];

export default function LessonsManagement({ lessons, setLessons, loadData }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    group: '',
    days: [] as string[],
    startTime: '',
    endTime: '',
  });

  const toggleDay = (day: string) => {
    setFormData(prev => ({
      ...prev,
      days: prev.days.includes(day)
        ? prev.days.filter(d => d !== day)
        : [...prev.days, day]
    }));
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/lessons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        setFormData({ title: '', group: '', days: [], startTime: '', endTime: '' });
        setIsEditing(false);
        loadData();
      } else {
        alert(data.error || 'Ошибка создания урока');
      }
    } catch (error) {
      console.error('Error creating lesson:', error);
      alert('Ошибка соединения');
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLesson) return;

    try {
      const res = await fetch('/api/admin/lessons', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ ...formData, id: editingLesson.id }),
      });

      if (res.ok) {
        setEditingLesson(null);
        setIsEditing(false);
        setFormData({ title: '', group: '', days: [], startTime: '', endTime: '' });
        loadData();
      }
    } catch (error) {
      console.error('Error updating lesson:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Удалить урок?')) return;

    try {
      const res = await fetch(`/api/admin/lessons?id=${id}`, {
        method: 'DELETE', credentials: 'include',
      });

      if (res.ok) {
        loadData();
      }
    } catch (error) {
      console.error('Error deleting lesson:', error);
    }
  };

  const startEdit = (lesson: Lesson) => {
    setEditingLesson(lesson);
    setFormData({
      title: lesson.title,
      group: lesson.group,
      days: lesson.days,
      startTime: lesson.startTime,
      endTime: lesson.endTime,
    });
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setEditingLesson(null);
    setIsEditing(false);
    setFormData({ title: '', group: '', days: [], startTime: '', endTime: '' });
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pt-20">
      <div className="flex items-center justify-between">
        <h1 className="font-display font-bold text-3xl text-slate-800">Расписание уроков</h1>
        <button
          onClick={() => setIsEditing(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl font-bold hover:bg-primary-dark transition-colors"
        >
          <Plus size={18} />
          Добавить урок
        </button>
      </div>

      {isEditing && (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold text-xl text-slate-800">
              {editingLesson ? 'Редактировать урок' : 'Новый урок'}
            </h2>
            <button onClick={cancelEdit} className="text-slate-400 hover:text-slate-600">
              <X size={24} />
            </button>
          </div>

          <form onSubmit={editingLesson ? handleUpdate : handleCreate} className="space-y-4">
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
              <label className="block text-sm font-bold text-slate-700 mb-2">Группа</label>
              <select
                value={formData.group}
                onChange={(e) => setFormData({ ...formData, group: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary"
                required
              >
                <option value="">Выберите группу</option>
                {GROUP_OPTIONS.map(group => (
                  <option key={group} value={group}>{group}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Дни недели</label>
              <div className="flex flex-wrap gap-2">
                {DAYS_OPTIONS.map(day => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleDay(day)}
                    className={`px-4 py-2 rounded-xl font-bold transition-colors ${
                      formData.days.includes(day)
                        ? 'bg-primary text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Начало</label>
                <input
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Окончание</label>
                <input
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary"
                  required
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary-dark transition-colors"
              >
                {editingLesson ? 'Сохранить изменения' : 'Создать урок'}
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
        {Array.isArray(lessons) && lessons.length > 0 ? (
          lessons.map((lesson) => (
            <div key={lesson.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
              <div>
                <h3 className="font-bold text-lg text-slate-800">{lesson.title}</h3>
                <div className="flex items-center gap-2 mt-2">
                  <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold">
                    {lesson.group}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <span className="font-bold">Дни:</span>
                  <span>{lesson.days.join(', ')}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <span className="font-bold">Время:</span>
                  <span>{lesson.startTime} - {lesson.endTime}</span>
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => startEdit(lesson)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-colors"
                >
                  <Edit size={16} />
                  Редактировать
                </button>
                <button
                  onClick={() => handleDelete(lesson.id)}
                  className="px-4 py-2 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-100 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-slate-500">Нет уроков. Нажмите "Добавить урок" чтобы создать первый урок.</p>
          </div>
        )}
      </div>
    </div>
  );
}
