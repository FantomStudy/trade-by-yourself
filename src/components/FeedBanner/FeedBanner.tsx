import clsx from "clsx";
import Image from "next/image";
import styles from "./FeedBanner.module.css";

interface FeedBannerProps extends React.ComponentProps<"a"> {
  href: string;
  src: string;
  name: string;
}

const Banner = ({ className, ...props }: React.ComponentProps<"span">) => {
  return <span className={clsx(styles.banner, className)} {...props} />;
};

export const FeedBanner = ({ href, src, name, ...props }: FeedBannerProps) => {
  return (
    <a href={href} className={styles.card} rel="noopener noreferrer" target="_blank" {...props}>
      <div className={styles.imageWrapper}>
        <Image src={src} alt={name} fill className={styles.image} />
        <Banner className={styles.bannerBadge}>Реклама</Banner>
      </div>
      <div className={styles.content}>
        <p className={styles.name}>{name}</p>
      </div>
    </a>
  );
};
