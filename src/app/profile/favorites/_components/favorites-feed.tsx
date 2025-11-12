import { ProductFeed } from "@/components/product";
import { getFavoritesProducts, ok } from "@/lib/api";

export const FavoritesFeed = async () => {
  const favorites = await ok(getFavoritesProducts());
  if (!favorites.success) {
    return <div>Ошибка загрузки избранного</div>;
  }

  return <ProductFeed products={favorites.data} />;
};
