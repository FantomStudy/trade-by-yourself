"use client";

import type { ProductFilters } from "@/api/products";
import { useBanners } from "@/hooks/useBanners";
import { useProducts } from "@/hooks/useProducts";
import { mergeFeed } from "@/lib/mergeFeed";
import { PRODUCT_PAGE_LIMIT } from "./constants";
import { FeedListItem } from "./FeedListItem";

interface FeedListProps {
  filters?: ProductFilters;
}

export const FeedList = ({ filters }: FeedListProps) => {
  const products = useProducts({ page: 2, limit: PRODUCT_PAGE_LIMIT, ...filters });
  const narrowBanners = useBanners({ place: "PRODUCT_FEED" });
  const wideBanners = useBanners({ place: "PROFILE" });

  if (!products.data || !narrowBanners.data || !wideBanners.data) return null;

  const merged = mergeFeed({
    products: products.data,
    narrowBanners: narrowBanners.data,
    wideBanners: wideBanners.data,
  });

  return (
    <>
      {merged.map((item) => (
        <FeedListItem key={item.key} item={item} />
      ))}
    </>
  );
};
