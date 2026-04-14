import Image from "next/image";
import { BannerBadge } from "@/components/BannerSlot";
import styles from "./FeedBanner.module.css";

interface FeedBannerProps extends React.ComponentProps<"a"> {
  href: string;
  src: string;
  name: string;
  size: "wide" | "narrow";
}

export const FeedBanner = ({ href, src, name, size, ...props }: FeedBannerProps) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.card}
      data-size={size}
      {...props}
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
