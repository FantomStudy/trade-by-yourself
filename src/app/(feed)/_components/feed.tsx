import { FeedWrapper } from "@/components/product";
import { getAllProducts } from "@/lib/api";

export const Feed = async () => {
  const products = await getAllProducts();

  // if (!products.success) {
  //   return (
  //     <div className="mx-auto max-w-7xl px-4 py-6">
  //       <div className="text-muted-foreground text-center">
  //         Ошибка загрузки ленты
  //       </div>
  //     </div>
  //   );
  // }

  return <FeedWrapper className="py-4" products={products} />;
};
