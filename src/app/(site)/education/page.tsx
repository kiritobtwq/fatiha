'use client';

import { Clock, Calendar, Users } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Lesson {
  id: number;
  title: string;
  group: string;
  days: string[];
  startTime: string;
  endTime: string;
  createdAt: string;
}

export default function EducationPage() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/lessons')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setLessons(data);
        }
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div className="py-20">
        <div className="container mx-auto px-4 text-center">
          <p className="text-text-secondary">Загрузка...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="font-display font-extrabold text-4xl md:text-5xl text-text-primary mb-6">
            Обучение
          </h1>
          <p className="text-text-secondary text-xl font-medium">
            Уроки для детей и взрослых
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {lessons.length > 0 ? lessons.map((lesson) => (
            <div key={lesson.id} className="card-container p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="flex-1">
                <h3 className="font-display font-bold text-2xl text-text-primary mb-3">{lesson.title}</h3>
                <div className="flex flex-wrap gap-4 text-sm text-text-secondary font-semibold">
                  <div className="flex items-center gap-2">
                    <Calendar className="text-primary" size={16} /> {lesson.days.join(', ')} — {lesson.startTime}–{lesson.endTime}
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="text-primary" size={16} /> {lesson.group}
                  </div>
                </div>
              </div>
            </div>
          )) : (
            <div className="text-center py-12 text-text-secondary">
              <p>Нет уроков</p>
            </div>
          )}
        </div>

        <div className="mt-16 text-center">
          <div className="card-container bg-bg-accent border-none p-8 rounded-3xl inline-block text-center">
            <h3 className="font-display font-bold text-2xl text-text-primary mb-4">
              Хотите присоединиться?
            </h3>
            <p className="text-text-secondary text-lg mb-6">
              Записаться на уроки можно при личном посещении мечети
            </p>
            <div className="flex items-center justify-center gap-2 text-primary font-semibold">
              <Clock size={20} />
              <span>Приходите в час до начала урока</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
