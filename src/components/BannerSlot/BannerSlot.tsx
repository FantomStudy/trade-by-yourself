"use client";

import type { BannerPlace } from "@/api/banners";
import Image from "next/image";
import { trackBannerView } from "@/api/banners";
import { useBanners } from "@/hooks/useBanners";
import { BannerBadge } from "./BannerBadge";
import styles from "./BannerSlot.module.css";

function pickRandom<T>(items: T[]): T | null {
  if (!items.length) return null;
  return items[Math.floor(Math.random() * items.length)];
}

interface BannerSlotProps {
  place: Exclude<BannerPlace, "PRODUCT_FEED">;
}

export const BannerSlot = ({ place }: BannerSlotProps) => {
  const banners = useBanners({ place });

  const banner = banners.data && pickRandom(banners.data);

  if (!banner) return null;

  return (
    <a
      href={banner.navigateToUrl}
      onClick={() => trackBannerView(banner.id)}
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className={styles.banner} data-place={place}>
        <Image src={banner.photoUrl} alt={banner.name} fill />
        <BannerBadge className={styles.badge} />
      </div>
    </a>
  );
};
