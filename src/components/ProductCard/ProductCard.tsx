import type { Route } from "next";
import type { Product } from "@/api/products";
import clsx from "clsx";
import { Calendar, CircleFadingArrowUpIcon, Sparkles, Zap } from "lucide-react";
import Link from "next/link";
import { Typography } from "@/components/ui";
import { formatDate, toCurrency } from "@/lib/format";
import { ProductCardPreview } from "./ProductCardPreview";
import styles from "./ProductCard.module.css";

interface ProductCardProps extends React.ComponentProps<"article"> {
  product: Product;
  action?: React.ReactNode;
  clickable?: boolean;
}

export const ProductCard = ({
  product,
  action,
  clickable = true,
  className,
  children,
  ...props
}: ProductCardProps) => {
  const href = `/product/${product.id}` as Route;
  const preview = <ProductCardPreview images={product.images} />;

  const isVip = Boolean(product.promotionLevel && product.promotionLevel >= 100);
  const isPaidAd = isVip || Boolean(product.promotionLevel && product.promotionLevel > 0) || Boolean(product.hasPromotion);
  const promoLevel = isVip ? "vip" : isPaidAd ? "standard" : "none";

  return (
    <article
      className={clsx(styles.card, className)}
      data-promoted={isPaidAd}
      data-promo-level={promoLevel}
      {...props}
    >
      <div className={styles.previewContainer}>
        {clickable ? <Link href={href}>{preview}</Link> : preview}

        {isVip ? (
          <div className={styles.vipBadge}>
            <Sparkles /> {product.promotionName || "VIP Топ"}
          </div>
        ) : isPaidAd ? (
          <div className={styles.standardBadge}>
            <Zap /> {product.promotionName || "В топе"}
          </div>
        ) : null}
      </div>

      <div className={styles.content}>
        <Typography className={styles.title}>
          {clickable ? <Link href={href}>{product.name}</Link> : product.name}
        </Typography>

        {Boolean(action) && <div className={styles.action}>{action}</div>}

        <Typography className={styles.address}>{product.address}</Typography>
        {product.createdAt && (
          <Typography className={styles.date}>
            <Calendar className={styles.dateIcon} />
            {formatDate(product.createdAt)}
          </Typography>
        )}
        <Typography className={styles.price}>{toCurrency(product.price)}</Typography>

        {isPaidAd && (
          <div className={isVip ? styles.vipSign : styles.promotedSign}>
            {isVip ? <Sparkles /> : <CircleFadingArrowUpIcon />}
            {isVip ? (product.promotionName || "VIP объявление") : (product.promotionName || "В топе")}
          </div>
        )}
      </div>

      {children}
    </article>
  );
};
