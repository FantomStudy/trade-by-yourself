import { Package } from "lucide-react";

import { FeedWrapper } from "@/components/feed-wrapper";
import { getCurrentUserProducts } from "@/lib/api";

export const MyProductsFeed = async () => {
  const products = await getCurrentUserProducts();

  console.log(products);
  if (!products) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg bg-white p-8 text-center shadow-sm">
        <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-red-50">
          <Package className="h-10 w-10 text-red-500" />
        </div>
        <h3 className="mb-2 text-xl font-semibold text-gray-800">
          Ошибка загрузки
        </h3>
        <p className="text-gray-600">Не удалось загрузить ваши объявления</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg bg-white p-8 text-center shadow-sm">
        <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-50">
          <Package className="h-10 w-10 text-green-500" />
        </div>
        <h3 className="mb-2 text-xl font-semibold text-gray-800">
          У вас пока нет объявлений
        </h3>
        <p className="mb-4 text-gray-600">
          Создайте свое первое объявление, чтобы начать продавать
        </p>
        <a
          href="/profile/create-product"
          className="rounded-lg bg-blue-500 px-6 py-2 text-white transition-colors hover:bg-blue-600"
        >
          Создать объявление
        </a>
      </div>
    );
  }

  return <FeedWrapper products={products} />;
};
