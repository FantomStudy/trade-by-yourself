import { FeedWrapper } from "@/components/product";
import { getFavoritesProducts } from "@/lib/api";

export const FavoritesFeed = async () => {
  const favorites = await getFavoritesProducts();

  if (!favorites) {
    return <div>Ошибка загрузки избранного</div>;
  }

  return <FeedWrapper products={favorites} />;
};
