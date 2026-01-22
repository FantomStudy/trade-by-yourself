import type { TypographyProps } from "@/app/(feed)/(search)/_lib/ui/typography";
import type { Product } from "@/types/product";

import clsx from "clsx";

import { Typography } from "@/components/ui";
import { formatPrice } from "@/lib/format";

import { ProductCardProvider, useProductCard } from "./ProductContext";

import styles from "./ProductCard.module.css";

export interface ProductCardProps extends React.ComponentProps<"div"> {
  product: Product;
}

export const ProductCard = ({
  product,
  className,
  children,
  ...props
}: ProductCardProps) => {
  return (
    <ProductCardProvider product={product}>
      <div className={clsx(styles.card, className)} {...props}>
        {children}
      </div>
    </ProductCardProvider>
  );
};

export const ProductCardMedia = ({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) => {
  return (
    <div className={clsx(styles.media, className)} {...props}>
      {children}
    </div>
  );
};

export interface ProductCardOverlayProps extends React.ComponentProps<"div"> {
  align?: "left" | "right";
}

export const ProductCardOverlay = ({
  align = "right",
  className,
  ...props
}: ProductCardOverlayProps) => {
  return (
    <div
      className={clsx(styles.overlay, className)}
      data-align={align}
      {...props}
    />
  );
};

export const ProductCardContent = ({
  className,
  ...props
}: React.ComponentProps<"div">) => {
  return <div className={clsx(styles.content, className)} {...props} />;
};

export const ProductCardAction = ({
  className,
  ...props
}: React.ComponentProps<"div">) => {
  return <div className={clsx(styles.action, className)} {...props} />;
};

export const ProductCardTitle = ({
  className,
  children,
  ...props
}: TypographyProps) => {
  const { product } = useProductCard();
  return (
    <Typography className={clsx(styles.title, className)} {...props}>
      {product.name}
    </Typography>
  );
};

export const ProductCardAddress = ({
  className,
  ...props
}: TypographyProps) => {
  const { product } = useProductCard();
  return (
    <Typography className={clsx(styles.address, className)} {...props}>
      {product.address}
    </Typography>
  );
};

export const ProductCardPrice = ({ className, ...props }: TypographyProps) => {
  const { product } = useProductCard();
  return (
    <Typography className={clsx(styles.price, className)} {...props}>
      {formatPrice(product.price)}
    </Typography>
  );
};
