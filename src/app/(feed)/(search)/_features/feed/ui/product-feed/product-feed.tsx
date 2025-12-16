"use client";

import type { FeedFilters } from "../../../product";

import { useQuery } from "@tanstack/react-query";
import { ArrowUp } from "lucide-react";
import Link from "next/link";
import { useQueryState } from "nuqs";

import { ProductCard } from "@/app/(feed)/(search)/_lib/ui/product-card";
import {
  ProductGrid,
  SkeletonGrid,
} from "@/app/(feed)/(search)/_lib/ui/product-grid";

import { LikeButton } from "../../../favorites";
import { getFeed } from "../../../product";

import styles from "./product-card.module.css";

export interface ProductFeedProps {
  filters?: Omit<FeedFilters, "search">;
}

export const ProductFeed = ({ filters }: ProductFeedProps) => {
  const [search] = useQueryState("search");

  const { isPending, isError, data } = useQuery({
    queryKey: ["products", filters, search],
    queryFn: async () =>
      getFeed({
        query: {
          ...filters,
          search: search || undefined,
        },
      }),
  });

  if (isError) return <div>Не удалось загрузить объявления</div>;

  if (isPending) return <SkeletonGrid />;

  return (
    <ProductGrid>
      {data.map((product) => (
        <ProductCard
          className={styles.card}
          key={product.id}
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
        </ProductCard>
      ))}
    </ProductGrid>
  );
};
