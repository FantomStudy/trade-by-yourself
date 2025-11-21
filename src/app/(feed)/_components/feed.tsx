import { FeedWrapper } from "@/components/feed-wrapper";
import { getProducts } from "@/lib/api";

export const Feed = async () => {
  const products = await getProducts();
  return <FeedWrapper products={products} />;
};
