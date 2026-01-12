"use client";

import Image from "next/image";
import { useQuery } from "@tanstack/react-query";

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
    <div className="relative overflow-hidden rounded-lg border border-gray-200">
      <div
        className="relative rounded-lg"
        style={{
          width: "100%",
          aspectRatio: "320 / 400",
        }}
      >
        <Image
          fill
          alt="Реклама"
          className="rounded-lg object-cover"
          src={banner.photoUrl}
          sizes="320px"
        />
      </div>
    </div>
  );
};
