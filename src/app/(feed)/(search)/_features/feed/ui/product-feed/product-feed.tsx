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
  const [search] = useQueryState("search");
  const [urlFilters] = useQueryStates(
    {
      minPrice: parseAsInteger,
      maxPrice: parseAsInteger,
      state: parseAsString,
      sortBy: parseAsString,
      region: parseAsString,
    },
    {
      history: "push",
      shallow: false,
    },
  );

  // Преобразуем значения из URL в формат API
  const apiFilters: FeedFilters = {
    ...filters,
    search: search || undefined,
    minPrice: urlFilters.minPrice ?? undefined,
    maxPrice: urlFilters.maxPrice ?? undefined,
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
  };

  const { isPending, isError, data } = useQuery({
    queryKey: ["products", apiFilters],
    queryFn: async () =>
      getFeed({
        query: {
          ...apiFilters,
        },
      }),
  });

  console.log(data?.map((p) => p.videoUrl));

  if (isError) return <div>Не удалось загрузить объявления</div>;

  if (isPending) return <SkeletonGrid />;

  if (!data || data.length === 0) {
    return <ProductGrid>{[]}</ProductGrid>;
  }

  // Функция для вставки баннеров в нужные позиции
  const renderProductsWithBanners = () => {
    const items: JSX.Element[] = [];
    let productIndex = 0;

    while (productIndex < data.length) {
      // Вставляем широкий баннер каждые 20 карточек (занимает место двух карточек)
      if (items.length > 0 && items.length % 20 === 0) {
        items.push(<WideBanner key={`wide-banner-${items.length}`} />);
        productIndex += 2; // Пропускаем 2 карточки
        continue;
      }
      // Вставляем узкий баннер на позиции 1, затем через каждые 6 элементов
      else if (
        items.length === 1 ||
        (items.length > 1 && (items.length - 1) % 6 === 0)
      ) {
        items.push(<ProductFeedBanner key={`banner-${items.length}`} />);
        productIndex++; // Пропускаем 1 карточку
        continue;
      }

      const product = data[productIndex];
      if (!product) break;

      items.push(
        <ProductCard
          key={product.id}
          product={product}
          className={clsx(product.hasPromotion && styles.promoted)}
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

    return items;
  };

  return <div className={styles.grid}>{renderProductsWithBanners()}</div>;
};
