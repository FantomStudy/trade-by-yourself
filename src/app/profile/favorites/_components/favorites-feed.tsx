import { Heart } from "lucide-react";

import { getFavorites } from "@/api-lab/favorites/getFavorites";
import { ProductCard } from "@/components/product-card";
import { ProductGrid } from "@/components/ProductGrid";

export const FavoritesFeed = async () => {
  const favorites = await getFavorites();

  if (!favorites) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg bg-white p-8 text-center shadow-sm">
        <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-red-50">
          <Heart className="h-10 w-10 text-red-500" />
        </div>
        <h3 className="mb-2 text-xl font-semibold text-gray-800">
          Ошибка загрузки
        </h3>
        <p className="text-gray-600">Не удалось загрузить избранные товары</p>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg bg-white p-8 text-center shadow-sm">
        <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-blue-50">
          <Heart className="h-10 w-10 text-blue-500" />
        </div>
        <h3 className="mb-2 text-xl font-semibold text-gray-800">
          Избранное пусто
        </h3>
        <p className="text-gray-600">
          Здесь будут отображаться товары, которые вы добавите в избранное
        </p>
      </div>
    );
  }

  return (
    <ProductGrid>
      {favorites.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </ProductGrid>
  );
};
