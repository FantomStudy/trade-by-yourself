"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";

import { getBanners, trackBannerView } from "@/api/requests/banner";

import styles from "./wide-banner.module.css";

export interface WideBannerProps {
  bannerIndex?: number;
}

export const WideBanner = ({ bannerIndex = 0 }: WideBannerProps) => {
  const { data: banners, isLoading } = useQuery({
    queryKey: ["banners", "PROFILE"],
    queryFn: async () => getBanners({ place: "PROFILE" }),
  });

  console.log("[WideBanner] Banners loaded:", banners?.length || 0);
  console.log("[WideBanner] Banner index:", bannerIndex);

  const profileBanners = banners?.filter((b) => b.place === "PROFILE") || [];
  const banner =
    profileBanners.length > 0 ? profileBanners[bannerIndex % profileBanners.length] : undefined;

  console.log("[WideBanner] Selected banner:", banner?.id, banner?.name);

  const handleBannerClick = () => {
    if (banner?.id) {
      trackBannerView(banner.id);
    }
  };

  if (isLoading) return null;

  if (!banner) return null;

  return (
    <a
      href={banner.navigateToUrl}
      className={styles.banner}
      rel="noopener noreferrer"
      target="_blank"
      onClick={handleBannerClick}
    >
      <div className={styles.imageWrapper}>
        <Image
          fill
          alt={banner.name}
          className={styles.image}
          sizes="(max-width: 768px) 100vw, 660px"
          src={banner.photoUrl}
        />
        <div className={styles.badge}>
          <span className={styles.badgeText}>Реклама</span>
        </div>
      </div>
      <div className={styles.content}>
        <p className={styles.name}>{banner.name}</p>
      </div>
    </a>
  );
};
