import type { Route } from "next";
import type { Product } from "@/api/products";
import clsx from "clsx";
import { CircleFadingArrowUpIcon } from "lucide-react";
import Link from "next/link";
import { Typography } from "@/components/ui";
import { formatPrice } from "@/lib/format";
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

  return (
    <article
      className={clsx(styles.card, className)}
      data-promoted={product.hasPromotion}
      {...props}
    >
      {clickable ? <Link href={href}>{preview}</Link> : preview}

      <div className={styles.content}>
        <Typography className={styles.title}>
          {clickable ? <Link href={href}>{product.name}</Link> : product.name}
        </Typography>

        {Boolean(action) && <div className={styles.action}>{action}</div>}

        <Typography className={styles.address}>{product.address}</Typography>
        <Typography className={styles.price}>{formatPrice(product.price)}</Typography>

        {product.hasPromotion && (
          <div className={styles.promotedSign}>
            <CircleFadingArrowUpIcon /> В топе
          </div>
        )}
      </div>

      {children}
    </article>
  );
};
