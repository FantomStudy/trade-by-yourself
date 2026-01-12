"use client";

import type { FeedFilters } from "../../../product";

import { useQuery } from "@tanstack/react-query";
import { ArrowUp } from "lucide-react";
import Link from "next/link";
import {
  parseAsInteger,
  parseAsString,
  useQueryState,
  useQueryStates,
} from "nuqs";

import { ProductCard } from "@/app/(feed)/(search)/_lib/ui/product-card";
import {
  ProductGrid,
  SkeletonGrid,
} from "@/app/(feed)/(search)/_lib/ui/product-grid";
import { ProductFeedBanner } from "@/components/product-feed-banner";

import { LikeButton } from "../../../favorites";
import { getFeed } from "../../../product";

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

    data.forEach((product, index) => {
      // Вставляем баннер на позиции 1 (второй элемент), затем через каждые 6 карточек
      // Позиции баннеров: 1, 7, 13, 19...
      if (index === 1 || (index > 1 && (index - 1) % 6 === 0)) {
        items.push(<ProductFeedBanner key={`banner-${index}`} />);
      }

      items.push(
        <ProductCard
          key={product.id}
          className={styles.card}
          data-promoted={product.hasPromotion}
          product={product}
        >
          <Link href={`/product/${product.id}`}>
            <ProductCard.Preview />
          </Link>

          <ProductCard.Content className={styles.content}>
            <Link href={`/product/${product.id}`}>
              <ProductCard.Title className={styles.title} />
            </Link>

            <ProductCard.Address />
            <ProductCard.Price className={styles.price} />

            <ProductCard.Actions>
              <LikeButton
                initLiked={product.isFavorited}
                productId={product.id}
              />
            </ProductCard.Actions>
          </ProductCard.Content>

          {product.hasPromotion && (
            <ProductCard.BottomActions className={styles.promotedSign}>
              <ArrowUp /> Поднят
            </ProductCard.BottomActions>
          )}
        </ProductCard>,
      );
    });

    return items;
  };

  return <ProductGrid>{renderProductsWithBanners()}</ProductGrid>;
};
