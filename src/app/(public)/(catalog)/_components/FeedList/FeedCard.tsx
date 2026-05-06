import type { FeedItem } from "../../_lib/getFeed";
import { FeedBanner } from "./FeedBanner";
import { LikeButton } from "./LikeButton";
import { ProductCard } from "./ProductCard";

interface FeedCardProps {
  item: FeedItem;
}

export const FeedCard = ({ item }: FeedCardProps) => {
  if (item.type === "product") {
    return (
      <ProductCard
        product={item.product}
        action={<LikeButton initLiked={item.product.isFavorited} productId={item.product.id} />}
      />
    );
  }

  return (
    <FeedBanner
      href={item.banner.navigateToUrl}
      src={item.banner.photoUrl}
      name={item.banner.name}
      size={item.size}
    />
  );
};
