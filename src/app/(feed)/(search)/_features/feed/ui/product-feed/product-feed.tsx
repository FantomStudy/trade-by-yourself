"use client";

import type { JSX } from "react";

import type { FeedFilters } from "../../../product";

import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { CircleFadingArrowUpIcon } from "lucide-react";
import Link from "next/link";
import {
  parseAsInteger,
  parseAsString,
  useQueryState,
  useQueryStates,
} from "nuqs";

import {
  ProductGrid,
  SkeletonGrid,
} from "@/app/(feed)/(search)/_lib/ui/product-grid";
import {
  ProductFeedBanner,
  WideBanner,
} from "@/components/product-feed-banner";

import { LikeButton } from "../../../favorites";
import { getFeed } from "../../../product";
import {
  ProductCard,
  ProductCardAction,
  ProductCardAddress,
  ProductCardContent,
  ProductCardMedia,
  ProductCardPreview,
  ProductCardPrice,
  ProductCardTitle,
} from "./ProductCard";

import styles from "./product-card.module.css";

const mapSortByToApi = (
  sortBy: string,
): "date_asc" | "date_desc" | "price_asc" | "price_desc" | "relevance" => {
  switch (sortBy) {
    case "price-desc":
      return "price_desc";
    case "price-asc":
      return "price_asc";
    case "newest":
      return "date_desc";
    case "relevance":
    default:
      return "relevance";
  }
};

export interface FeedProps {
  filters?: Omit<
    FeedFilters,
    "maxPrice" | "minPrice" | "search" | "sortBy" | "state"
  >;
}

export const ProductFeed = ({ filters }: FeedProps) => {
  console.log("[ProductFeed] Component rendered with filters:", filters);

  const [search] = useQueryState("search");
  const [urlFilters] = useQueryStates(
    {
      minPrice: parseAsInteger,
      maxPrice: parseAsInteger,
      minRating: parseAsInteger,
      maxRating: parseAsInteger,
      state: parseAsString,
      sortBy: parseAsString,
      region: parseAsString,
      profileType: parseAsString,
      fieldValues: parseAsString,
    },
    {
      history: "push",
      shallow: false,
    },
  );

  console.log("[ProductFeed] URL filters:", {
    search,
    urlFilters,
  });

  // Преобразуем значения из URL в формат API
  const apiFilters: FeedFilters = {
    ...filters,
    search: search || undefined,
    minPrice: urlFilters.minPrice ?? undefined,
    maxPrice: urlFilters.maxPrice ?? undefined,
    minRating: urlFilters.minRating ?? undefined,
    maxRating: urlFilters.maxRating ?? undefined,
    state:
      urlFilters.state && urlFilters.state !== ""
        ? (urlFilters.state.toUpperCase() as "NEW" | "USED")
        : undefined,
    sortBy:
      urlFilters.sortBy && urlFilters.sortBy !== ""
        ? mapSortByToApi(urlFilters.sortBy)
        : undefined,
    region:
      urlFilters.region && urlFilters.region !== ""
        ? urlFilters.region
        : undefined,
    profileType:
      urlFilters.profileType && urlFilters.profileType !== ""
        ? (urlFilters.profileType as "INDIVIDUAL" | "OOO" | "IP")
        : undefined,
    fieldValues:
      urlFilters.fieldValues && urlFilters.fieldValues !== ""
        ? (JSON.parse(urlFilters.fieldValues) as Record<string, string>)
        : undefined,
  };

  console.log("[ProductFeed] API filters:", apiFilters);

  console.log("[ProductFeed] API filters:", apiFilters);

  const { isPending, isError, data } = useQuery({
    queryKey: ["products", apiFilters],
    queryFn: async () => {
      console.log("[ProductFeed] Fetching products with filters:", apiFilters);
      const result = await getFeed({
        query: {
          ...apiFilters,
        },
      });
      console.log("[ProductFeed] Received products:", result?.length || 0);
      console.log(
        "[ProductFeed] Promoted products:",
        result?.filter((p) => p.hasPromotion).length || 0,
      );
      console.log(
        "[ProductFeed] Products with hasPromotion flag:",
        result
          ?.filter((p) => p.hasPromotion)
          .map((p) => ({
            id: p.id,
            name: p.name,
            hasPromotion: p.hasPromotion,
          })),
      );
      return result;
    },
  });

  console.log("[ProductFeed] Query state:", {
    isPending,
    isError,
    dataLength: data?.length,
  });
  console.log(data?.map((p) => p.videoUrl));

  if (isError) {
    console.error("[ProductFeed] Error loading products");
    return <div>Не удалось загрузить объявления</div>;
  }

  if (isPending) {
    console.log("[ProductFeed] Loading products...");
    return <SkeletonGrid />;
  }

  if (!data || data.length === 0) {
    console.log("[ProductFeed] No products found");
    return <ProductGrid>{[]}</ProductGrid>;
  }

  console.log("[ProductFeed] Rendering", data.length, "products");

  console.log("[ProductFeed] Rendering", data.length, "products");

  // Функция для вставки баннеров в нужные позиции
  const renderProductsWithBanners = () => {
    console.log("[ProductFeed] Building product grid with banners");
    const items: JSX.Element[] = [];
    let productIndex = 0;
    let bannersAdded = 0;
    let narrowBannerIndex = 0; // Счетчик для узких баннеров
    let wideBannerIndex = 0; // Счетчик для широких баннеров

    while (productIndex < data.length) {
      // Вставляем широкий баннер каждые 20 карточек (занимает место двух карточек)
      if (items.length > 0 && items.length % 20 === 0) {
        console.log(
          `[ProductFeed] Adding wide banner at position ${items.length}, index ${wideBannerIndex}`,
        );
        items.push(
          <WideBanner
            key={`wide-banner-${items.length}`}
            bannerIndex={wideBannerIndex}
          />,
        );
        productIndex += 2; // Пропускаем 2 карточки
        bannersAdded++;
        wideBannerIndex++;
        continue;
      }
      // Вставляем узкий баннер на позиции 1, затем через каждые 6 элементов
      else if (
        items.length === 1 ||
        (items.length > 1 && (items.length - 1) % 6 === 0)
      ) {
        console.log(
          `[ProductFeed] Adding narrow banner at position ${items.length}, index ${narrowBannerIndex}`,
        );
        items.push(
          <ProductFeedBanner
            key={`banner-${items.length}`}
            bannerIndex={narrowBannerIndex}
          />,
        );
        productIndex++; // Пропускаем 1 карточку
        bannersAdded++;
        narrowBannerIndex++;
        continue;
      }

      const product = data[productIndex];
      if (!product) break;

      const isPromoted = product.hasPromotion;
      if (isPromoted) {
        console.log(`[ProductFeed] Rendering promoted product:`, {
          id: product.id,
          name: product.name,
          hasPromotion: product.hasPromotion,
          position: items.length,
        });
      }

      items.push(
        <ProductCard
          key={product.id}
          className={clsx(product.hasPromotion && styles.promoted)}
          product={product}
        >
          <ProductCardMedia>
            <Link href={`/product/${product.id}`}>
              <ProductCardPreview />
            </Link>
          </ProductCardMedia>
          <ProductCardContent>
            <Link href={`/product/${product.id}`}>
              <ProductCardTitle />
            </Link>
            <ProductCardAction>
              <LikeButton
                initLiked={product.isFavorited}
                productId={product.id}
              />
            </ProductCardAction>
            <ProductCardAddress />
            <ProductCardPrice />
            {product.hasPromotion && (
              <div className={styles.promotedSign}>
                <CircleFadingArrowUpIcon /> В топе
              </div>
            )}
          </ProductCardContent>
        </ProductCard>,
      );

      productIndex++;
    }

    console.log(
      `[ProductFeed] Grid built: ${items.length} total items (${items.length - bannersAdded} products, ${bannersAdded} banners)`,
    );
    console.log(
      `[ProductFeed] Narrow banners: ${narrowBannerIndex}, Wide banners: ${wideBannerIndex}`,
    );
    return items;
  };

  return <div className={styles.grid}>{renderProductsWithBanners()}</div>;
};
