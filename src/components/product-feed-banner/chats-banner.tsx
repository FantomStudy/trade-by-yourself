"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useEffect } from "react";

import { getBanners, trackBannerView } from "@/api/requests/banner";

export const ChatsBanner = () => {
  const { data: banners, isLoading } = useQuery({
    queryKey: ["banners", "CHATS"],
    queryFn: async () => getBanners({ place: "CHATS" }),
  });

  const chatBanners = banners?.filter((b) => b.place === "CHATS") || [];
  const banner = chatBanners.length > 0 ? chatBanners[0] : undefined;

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
      onClick={handleBannerClick}
    >
      <div className="relative h-[200px] w-full sm:h-[300px] lg:h-[400px]">
        <Image
          fill
          alt={banner.name}
          className="object-cover"
          src={banner.photoUrl}
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
