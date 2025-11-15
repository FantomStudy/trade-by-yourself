import { FeedWrapper } from "@/components/product";
import { getCurrentUserProducts } from "@/lib/api";

export const MyProductsFeed = async () => {
  const products = await getCurrentUserProducts();

  if (!products) {
    return <div>Ошибка загрузки товаров</div>;
  }

  return <FeedWrapper products={products} />;
};
