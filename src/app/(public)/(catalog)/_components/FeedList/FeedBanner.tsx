"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { trackBannerView } from "@/api/banners";
import { BannerBadge } from "@/components/BannerSlot";
import styles from "./FeedBanner.module.css";

interface FeedBannerProps {
  bannerId: number;
  href: string;
  src: string;
  name: string;
  size: "wide" | "narrow";
}

export const FeedBanner = ({ bannerId, href, src, name, size }: FeedBannerProps) => {
  const trackedRef = useRef(false);

  useEffect(() => {
    if (!bannerId || trackedRef.current) return;
    trackedRef.current = true;
    void trackBannerView(bannerId);
  }, [bannerId]);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.card}
      data-size={size}
    >
      <div className={styles.imageWrapper}>
        <Image src={src} alt={name} fill />
        <BannerBadge className={styles.badge} />
      </div>
      <div className={styles.content}>
        <p className={styles.name}>{name}</p>
      </div>
    </a>
  );
};
