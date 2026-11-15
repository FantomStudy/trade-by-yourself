import type { Banner } from "@/api/banners";
import type { Product, ProductFilters } from "@/api/products";
import { getBanners } from "@/api/banners";
import { getProducts } from "@/api/products";

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

const mergeFeed = ({
  products = [],
  narrowBanners = [],
  wideBanners = [],
  startIndex = 0,
}: MergeFeedParams): FeedItem[] => {
  const items: FeedItem[] = [];
  const safeProducts = Array.isArray(products) ? products : [];
  const safeNarrow = Array.isArray(narrowBanners) ? narrowBanners : [];
  const safeWide = Array.isArray(wideBanners) ? wideBanners : [];

  for (let i = 0; i < safeProducts.length; i++) {
    const product = safeProducts[i];
    const globalIndex = startIndex + i + 1;

    items.push({
      type: "product",
      key: `product-${product.id}`,
      product,
    });

    const shouldRenderWideBanner =
      safeWide.length > 0 && globalIndex % WIDE_BANNER_INTERVAL === 0;

    if (shouldRenderWideBanner) {
      const wideSlotIndex = Math.floor(globalIndex / WIDE_BANNER_INTERVAL) - 1;
      const banner = safeWide[wideSlotIndex % safeWide.length];

      items.push({
        type: "banner",
        key: `wide-banner-${banner.id}-${wideSlotIndex}`,
        banner,
        size: "wide",
      });

      continue;
    }

    const shouldRenderNarrowBanner =
      safeNarrow.length > 0 && globalIndex % NARROW_BANNER_INTERVAL === 0;

    if (shouldRenderNarrowBanner) {
      const narrowSlotIndex = Math.floor(globalIndex / NARROW_BANNER_INTERVAL) - 1;
      const banner = safeNarrow[narrowSlotIndex % safeNarrow.length];

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

interface GetFeedParams extends ProductFilters {
  page: number;
}

export const getFeed = async ({ page, limit = 40, ...filters }: GetFeedParams) => {
  const [products, narrowBanners, wideBanners] = await Promise.all([
    getProducts({ ...filters, page, limit }),
    getBanners({ place: "PRODUCT_FEED" }),
    getBanners({ place: "PROFILE" }),
  ]);

  return mergeFeed({
    products: Array.isArray(products) ? products : [],
    narrowBanners: Array.isArray(narrowBanners) ? narrowBanners : [],
    wideBanners: Array.isArray(wideBanners) ? wideBanners : [],
    startIndex: (page - 1) * limit,
  });
};
