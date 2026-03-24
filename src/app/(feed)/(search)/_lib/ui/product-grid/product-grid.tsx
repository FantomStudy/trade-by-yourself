import clsx from "clsx";

import { Skeleton } from "../skeleton";

import styles from "./product-grid.module.css";

export const ProductGrid = ({ className, ...props }: React.ComponentProps<"div">) => {
  return <div className={clsx(styles.grid, className)} {...props} />;
};

interface SkeletonGridProps extends React.ComponentProps<"div"> {
  count?: number;
}

export const SkeletonGrid = ({ count = 12, ...props }: SkeletonGridProps) => {
  return (
    <ProductGrid {...props}>
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} />
      ))}
    </ProductGrid>
  );
};
