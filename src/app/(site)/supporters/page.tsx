'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Heart, Crown, ArrowRight } from 'lucide-react';

interface Donation {
  id: number;
  amount: number;
  donorName: string;
  createdAt: string;
}

export default function SupportersPage() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/donations?status=succeeded&limit=100')
      .then(res => res.json())
      .then(data => {
        if (!data.error) setDonations(data.donations);
        setIsLoading(false);
      });
  }, []);

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('ru-RU').format(num);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const topDonors = donations.length > 0
    ? donations
        .reduce((acc, d) => {
          const existing = acc.find(x => x.name.toLowerCase() === d.donorName.toLowerCase());
          if (existing) {
            existing.amount += d.amount;
          } else {
            acc.push({ name: d.donorName, amount: d.amount });
          }
          return acc;
        }, [] as { name: string; amount: number }[])
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 3)
    : [];

  return (
    <div className="py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="font-display font-extrabold text-4xl md:text-5xl text-text-primary mb-6">
              Жертвователи
            </h1>
            <p className="text-text-secondary text-xl font-medium">
              Спасибо каждому, кто поддерживает мечеть
            </p>
          </div>

          {topDonors.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
              {topDonors.map((donor, i) => (
                <div
                  key={i}
                  className={`card-container p-8 text-center ${i === 0 ? 'ring-4 ring-primary/20' : ''}`}
                >
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary font-extrabold text-2xl mx-auto mb-4">
                    {i === 0 ? <Crown size={32} /> : donor.name.charAt(0)}
                  </div>
                  <h3 className="font-display font-bold text-xl text-text-primary mb-2">
                    {donor.name}
                  </h3>
                  <p className="text-2xl font-extrabold text-primary">
                    {formatNumber(Math.floor(donor.amount))} ₽
                  </p>
                  <p className="text-text-secondary text-sm font-semibold mt-2">
                    Место {i + 1}
                  </p>
                </div>
              ))}
            </div>
          )}


          <div className="card-container overflow-hidden">
            <div className="p-8 border-b border-border bg-bg">
              <h3 className="font-display font-bold text-2xl text-text-primary">
                Все пожертвования
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left px-8 py-4 text-sm font-bold text-text-secondary uppercase tracking-widest">
                      Жертвователь
                    </th>
                    <th className="text-left px-8 py-4 text-sm font-bold text-text-secondary uppercase tracking-widest">
                      Назначение
                    </th>
                    <th className="text-left px-8 py-4 text-sm font-bold text-text-secondary uppercase tracking-widest">
                      Дата
                    </th>
                    <th className="text-right px-8 py-4 text-sm font-bold text-text-secondary uppercase tracking-widest">
                      Сумма
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {isLoading ? (
                    <tr>
                      <td colSpan={4} className="px-8 py-12 text-center text-text-secondary">
                        Загрузка...
                      </td>
                    </tr>
                  ) : donations.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-8 py-12 text-center text-text-secondary">
                        Пока нет пожертвований
                      </td>
                    </tr>
                  ) : (
                    donations.map((donation) => (
                      <tr key={donation.id} className="hover:bg-bg-accent/30 transition-colors">
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-extrabold">
                              {donation.donorName.charAt(0)}
                            </div>
                            <span className="font-semibold text-text-primary">{donation.donorName}</span>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-text-secondary font-medium">
                          Строительство мечети
                        </td>
                        <td className="px-8 py-6 text-text-secondary font-medium">
                          {formatDate(donation.createdAt)}
                        </td>
                        <td className="px-8 py-6 text-right">
                          <span className="font-extrabold text-primary">
                            {formatNumber(Math.floor(donation.amount))} ₽
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
