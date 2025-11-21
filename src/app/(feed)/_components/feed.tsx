import { getProducts } from "@/api/requests";
import { FeedWrapper } from "@/components/feed-wrapper";

export const Feed = async () => {
  const products = await getProducts();
  return <FeedWrapper products={products} />;
};
