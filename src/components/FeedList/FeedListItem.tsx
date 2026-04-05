import type { FeedItem } from "@/lib/mergeFeed";
import { FeedBanner } from "../FeedBanner";
import { LikeButton } from "../LikeButton";
import { ProductCard } from "../ProductCard";

interface FeedListItemProps {
  item: FeedItem;
}

export const FeedListItem = ({ item }: FeedListItemProps) => {
  if (item.type === "product") {
    return (
      <ProductCard
        key={item.key}
        product={item.product}
        action={<LikeButton initLiked={item.product.isFavorited} productId={item.product.id} />}
      />
    );
  }

  return (
    <FeedBanner
      href={item.banner.navigateToUrl}
      name={item.banner.name}
      src={item.banner.photoUrl}
      data-size={item.size}
    />
  );
};
