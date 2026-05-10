"use client";

import type { BannerPlace } from "@/api/banners";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { getBanners, trackBannerView } from "@/api/banners";
import { BannerBadge } from "./BannerBadge";
import { pickRandom } from "./utils";
import styles from "./BannerSlot.module.css";

interface BannerSlotProps {
  place: Exclude<BannerPlace, "PRODUCT_FEED">;
}

export const BannerSlot = ({ place }: BannerSlotProps) => {
  const banners = useQuery({
    queryKey: ["banners", place],
    queryFn: () => getBanners({ place }),
  });

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
        <BannerBadge className={styles.badgePosition} />
      </div>
    </a>
  );
};
