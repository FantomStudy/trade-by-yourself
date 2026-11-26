"use client";

import type { BannerPlace } from "@/api/banners";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { getBanners, trackBannerView } from "@/api/banners";
import { useEffect, useRef, useState } from "react";
import { BannerBadge } from "./BannerBadge";
import { pickRandom } from "./utils";
import styles from "./BannerSlot.module.css";

interface BannerSlotProps {
  place: Exclude<BannerPlace, "PRODUCT_FEED">;
}

export const BannerSlot = ({ place }: BannerSlotProps) => {
  const [hasError, setHasError] = useState(false);
  const trackedRef = useRef<Set<number>>(new Set());
  const banners = useQuery({
    queryKey: ["banners", place],
    queryFn: () => getBanners({ place }),
  });

  const banner = banners.data && pickRandom(banners.data);

  useEffect(() => {
    if (!banner?.id || hasError || !banner.photoUrl) return;
    if (trackedRef.current.has(banner.id)) return;
    trackedRef.current.add(banner.id);
    void trackBannerView(banner.id);
  }, [banner?.id, banner?.photoUrl, hasError]);

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
