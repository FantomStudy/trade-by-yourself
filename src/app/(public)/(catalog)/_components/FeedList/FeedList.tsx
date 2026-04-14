"use client";

import type { ProductFilters } from "@/api/products";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { getFeed } from "../../_lib/feed";
import { PRODUCT_PAGE_LIMIT } from "./constants";
import { FeedCard } from "./FeedCard";

interface FeedListProps {
  filters?: ProductFilters;
}

export const FeedList = ({ filters }: FeedListProps) => {
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ["feed", filters],
    initialPageParam: 2,
    queryFn: ({ pageParam }) =>
      getFeed({
        ...filters,
        page: pageParam,
        limit: PRODUCT_PAGE_LIMIT,
      }),
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length === 0) return undefined;
      return allPages.length + 2;
    },
  });

  useEffect(() => {
    const node = loadMoreRef.current;
    if (!node || !hasNextPage) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: "400px 0px" },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const items = data?.pages.flat() ?? [];

  return (
    <>
      {items.map((item) => (
        <FeedCard key={item.key} item={item} />
      ))}
      {hasNextPage ? <div ref={loadMoreRef} aria-hidden="true" /> : null}
    </>
  );
};
