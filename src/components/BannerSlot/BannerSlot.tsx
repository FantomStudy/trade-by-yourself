"use client";

import type { BannerPlace } from "@/api/banners";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { getBanners, trackBannerView } from "@/api/banners";
import { useState } from "react";
import { BannerBadge } from "./BannerBadge";
import { pickRandom } from "./utils";
import styles from "./BannerSlot.module.css";

interface BannerSlotProps {
  place: Exclude<BannerPlace, "PRODUCT_FEED">;
}

export const BannerSlot = ({ place }: BannerSlotProps) => {
  const [hasError, setHasError] = useState(false);
  const banners = useQuery({
    queryKey: ["banners", place],
    queryFn: () => getBanners({ place }),
  });

  const banner = banners.data && pickRandom(banners.data);

  if (!banner || hasError || !banner.photoUrl) return null;

  return (
    <a
      href={banner.navigateToUrl || "#"}
      onClick={() => trackBannerView(banner.id)}
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className={styles.banner} data-place={place}>
        <Image
          src={banner.photoUrl}
          alt={banner.name || "Реклама"}
          fill
          unoptimized
          onError={() => setHasError(true)}
        />
        <BannerBadge className={styles.badgePosition} />
      </div>
    </a>
  );
};
