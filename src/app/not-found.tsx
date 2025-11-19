import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-200px)] flex-col items-center justify-center px-4">
      <div className="text-center">
        {/* 404 число */}
        <h1 className="mb-4 text-9xl font-bold text-blue-500">404</h1>

        {/* Заголовок */}
        <h2 className="mb-2 text-3xl font-semibold text-gray-800">
          Страница не найдена
        </h2>

        {/* Описание */}
        <p className="mb-8 text-lg text-gray-600">
          К сожалению, запрашиваемая страница не существует или была удалена
        </p>

        {/* Кнопки навигации */}
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="rounded-lg bg-blue-500 px-6 py-3 text-white transition-colors hover:bg-blue-600"
          >
            На главную
          </Link>
          <Link
            href="/profile/my-products"
            className="rounded-lg border border-gray-300 bg-white px-6 py-3 text-gray-700 transition-colors hover:bg-gray-50"
          >
            Мои объявления
          </Link>
        </div>
      </div>
    </div>
  );
}
