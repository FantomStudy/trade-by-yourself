import { ProductFeed } from "@/components/product";
import { getCurrentUserProducts, ok } from "@/lib/api";

export const MyProductsFeed = async () => {
  const products = await ok(getCurrentUserProducts());

  if (!products.success) {
    return <div>Ошибка загрузки товаров</div>;
  }

  return <ProductFeed products={products.data} />;
};
