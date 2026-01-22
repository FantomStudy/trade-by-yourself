"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";

import { getBanners } from "@/api/requests/banner";

export const ProductFeedBanner = () => {
  const { data: banners, isLoading } = useQuery({
    queryKey: ["banners", "PRODUCT_FEED"],
    queryFn: async () => getBanners(),
  });

  if (isLoading) return null;

  const banner = banners?.find((b) => b.place === "PRODUCT_FEED");

  if (!banner) return null;

  return (
    <a
      href={banner.navigateToUrl}
      className="flex h-full flex-col overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--background)] transition-opacity hover:opacity-90"
      rel="noopener noreferrer"
      target="_blank"
    >
      <div
        style={{
          width: "100%",
          aspectRatio: "320 / 400",
        }}
        className="relative"
      >
        <Image
          fill
          alt={banner.name}
          className="object-cover"
          sizes="320px"
          src={banner.photoUrl}
        />
        <div className="absolute bottom-2 left-2 inline-flex rounded-full bg-gray-200/80 px-2 py-0.5">
          <span className="text-[10px] font-medium text-gray-700 uppercase">
            Реклама
          </span>
        </div>
      </div>
      <div className="p-3">
        <p className="text-sm font-medium text-[var(--foreground)]">
          {banner.name}
        </p>
      </div>
    </a>
  );
};
