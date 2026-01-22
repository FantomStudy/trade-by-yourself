"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useEffect } from "react";

import { getBanners, trackBannerView } from "@/api/requests/banner";

export const WideBanner = () => {
  const { data: banners, isLoading } = useQuery({
    queryKey: ["banners", "PROFILE"],
    queryFn: async () => getBanners(),
  });

  const banner = banners?.find((b) => b.place === "PROFILE");

  useEffect(() => {
    if (banner?.id) {
      trackBannerView(banner.id);
    }
  }, [banner?.id]);

  if (isLoading) return null;

  if (!banner) return null;

  return (
    <a
      href={banner.navigateToUrl}
      className="flex h-full flex-col overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--background)] transition-opacity hover:opacity-90"
      rel="noopener noreferrer"
      style={{ gridColumn: "span 2" }}
      target="_blank"
    >
      <div
        style={{
          width: "100%",
          aspectRatio: "660 / 400",
        }}
        className="relative"
      >
        <Image
          fill
          alt={banner.name}
          className="object-cover"
          sizes="660px"
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
