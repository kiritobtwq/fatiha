import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-8">
      <div className="text-center space-y-4">
        <h2 className="text-6xl font-black text-slate-200">404</h2>
        <h3 className="text-2xl font-bold text-slate-800">Страница не найдена</h3>
        <p className="text-slate-500">Запрашиваемая страница не существует</p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary-dark transition-colors"
        >
          На главную
        </Link>
      </div>
    </div>
  );
}
