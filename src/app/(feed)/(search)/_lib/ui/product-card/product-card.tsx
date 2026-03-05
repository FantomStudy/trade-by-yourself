import type { TypographyProps } from "../typography";
import type { Product } from "@/types/products";

import clsx from "clsx";
import { formatPrice } from "../../utils/format";
import { ProductPreview } from "../product-preview";
import { ProductCardProvider, useProductCard } from "./product-card-context";
import styles from "./product-card.module.css";

export interface ProductCardProps extends React.ComponentProps<"article"> {
  product: Product;
}

const ProductCardRoot = (props: ProductCardProps) => {
  const { product, children, className, ...rest } = props;

  return (
    <ProductCardProvider product={product}>
      <article className={clsx(styles.card, className)} {...rest}>
        {children}
      </article>
    </ProductCardProvider>
  );
};

const Actions = ({ className, ...props }: React.ComponentProps<"div">) => {
  return <div className={clsx(styles.actions, className)} {...props} />;
};

const TopActions = ({ className, ...props }: React.ComponentProps<"div">) => {
  return <div className={clsx(styles.topActions, className)} {...props} />;
};

const BottomActions = ({
  className,
  ...props
}: React.ComponentProps<"div">) => {
  return <div className={clsx(styles.bottomActions, className)} {...props} />;
};

const Preview = (props: React.ComponentProps<"div">) => {
  const { product } = useProductCard();
  return <ProductPreview images={product.images} {...props} />;
};

const Content = ({ className, ...props }: React.ComponentProps<"div">) => {
  return (
    <div
      className={clsx(styles.content, className)}
      data-slot="content"
      {...props}
    />
  );
};

const Title = ({ className, ...props }: TypographyProps) => {
  const { product } = useProductCard();
  return (
    <Typography className={clsx(styles.title, className)} {...props}>
      {product.name}
    </Typography>
  );
};

const Address = ({ className, ...props }: TypographyProps) => {
  const { product } = useProductCard();
  return (
    <Typography className={clsx(styles.address, className)} {...props}>
      {product.address}
    </Typography>
  );
};

const Price = ({ className, ...props }: TypographyProps) => {
  const { product } = useProductCard();
  return (
    <Typography className={clsx(styles.price, className)} {...props}>
      {formatPrice(product.price)}
    </Typography>
  );
};

export const ProductCard = Object.assign(ProductCardRoot, {
  Actions,
  TopActions,
  BottomActions,
  Content,
  Title,
  Address,
  Price,
  Preview,
});
