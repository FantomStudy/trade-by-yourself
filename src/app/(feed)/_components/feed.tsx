import { ProductFeed } from "@/components/product";
import { getAllProducts, ok } from "@/lib/api";

export const Feed = async () => {
  const products = await ok(getAllProducts());

  if (!products.success) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="text-muted-foreground text-center">
          Ошибка загрузки ленты
        </div>
      </div>
    );
  }

  return <ProductFeed className="py-4" products={products.data} />;
};
