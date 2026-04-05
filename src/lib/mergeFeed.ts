import type { Banner } from "@/api/banners/getBanners";
import type { Product } from "@/api/products/getProducts";

const NARROW_BANNER_INTERVAL = 6;
const WIDE_BANNER_INTERVAL = 20;

interface MergeFeedParams {
  products: Product[];
  narrowBanners: Banner[];
  wideBanners: Banner[];
  startIndex?: number;
}

export type FeedItem =
  | { type: "product"; key: string; product: Product }
  | { type: "banner"; key: string; banner: Banner; size: "narrow" | "wide" };

export const mergeFeed = ({
  products,
  narrowBanners,
  wideBanners,
  startIndex = 0,
}: MergeFeedParams): FeedItem[] => {
  const items: FeedItem[] = [];

  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    const globalIndex = startIndex + i + 1;

    items.push({
      type: "product",
      key: `product-${product.id}`,
      product,
    });

    const shouldRenderWideBanner =
      wideBanners.length > 0 && globalIndex % WIDE_BANNER_INTERVAL === 0;

    if (shouldRenderWideBanner) {
      const wideSlotIndex = Math.floor(globalIndex / WIDE_BANNER_INTERVAL) - 1;
      const banner = wideBanners[wideSlotIndex % wideBanners.length];

      items.push({
        type: "banner",
        key: `wide-banner-${banner.id}-${wideSlotIndex}`,
        banner,
        size: "wide",
      });

      continue;
    }

    const shouldRenderNarrowBanner =
      narrowBanners.length > 0 && globalIndex % NARROW_BANNER_INTERVAL === 0;

    if (shouldRenderNarrowBanner) {
      const narrowSlotIndex = Math.floor(globalIndex / NARROW_BANNER_INTERVAL) - 1;
      const banner = narrowBanners[narrowSlotIndex % narrowBanners.length];

      items.push({
        type: "banner",
        key: `narrow-banner-${banner.id}-${narrowSlotIndex}`,
        banner,
        size: "narrow",
      });
    }
  }

  return items;
};
