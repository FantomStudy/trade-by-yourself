import Image from "next/image";
import { BannerBadge } from "./BannerSlot";
import styles from "./FeedBanner.module.css";

interface FeedBannerProps {
  href: string;
  src: string;
  name: string;
  size: "wide" | "narrow";
}

export const FeedBanner = ({ href, src, name, size }: FeedBannerProps) => {
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
