'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-8">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">Произошла ошибка</h2>
        <p className="text-slate-500">{error.message || 'Что-то пошло не так'}</p>
        <button
          onClick={reset}
          className="px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary-dark transition-colors"
        >
          Попробовать снова
        </button>
      </div>
    </div>
  );
}
