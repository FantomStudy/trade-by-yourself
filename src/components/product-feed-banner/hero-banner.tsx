"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

import { getBanners, trackBannerView } from "@/api/requests/banner";

export const FavoritesBanner = () => {
  const [selectedBannerIndex, setSelectedBannerIndex] = useState<number | null>(
    null,
  );

  const { data: banners, isLoading } = useQuery({
    queryKey: ["banners", "FAVORITES"],
    queryFn: async () => getBanners({ place: "FAVORITES" }),
  });

  const favoritesBanners =
    banners?.filter((b) => b.place === "FAVORITES") || [];

  // Выбираем рандомный баннер при первой загрузке
  useEffect(() => {
    if (favoritesBanners.length > 0 && selectedBannerIndex === null) {
      const randomIndex = Math.floor(Math.random() * favoritesBanners.length);
      setSelectedBannerIndex(randomIndex);
    }
  }, [favoritesBanners.length, selectedBannerIndex]);

  const banner = useMemo(() => {
    if (selectedBannerIndex === null || favoritesBanners.length === 0) {
      return undefined;
    }
    return favoritesBanners[selectedBannerIndex];
  }, [favoritesBanners, selectedBannerIndex]);

  // Отслеживание просмотра баннера
  useEffect(() => {
    if (banner) {
      trackBannerView(banner.id);
    }
  }, [banner]);

  if (isLoading || !banner) {
    return null;
  }

  const handleBannerClick = () => {
    if (banner.navigateToUrl) {
      window.open(banner.navigateToUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div
      className="relative w-full cursor-pointer overflow-hidden rounded-lg"
      style={{ maxHeight: "200px" }}
      onClick={handleBannerClick}
    >
      <div className="relative h-[200px] w-full">
        <Image
          fill
          alt={banner.name}
          className="object-cover"
          src={banner.photoUrl}
          priority
        />
        <div className="absolute bottom-2 left-2 inline-flex rounded-full bg-gray-200/80 px-2 py-0.5">
          <span className="text-[10px] font-medium text-gray-700 uppercase">
            Реклама
          </span>
        </div>
      </div>
    </div>
  );
};
