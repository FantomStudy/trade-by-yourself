import clsx from "clsx";
import styles from "./ProductGrid.module.css";

export const ProductGrid = ({
  className,
  ...props
}: React.ComponentProps<"div">) => {
  return <div className={clsx(styles.grid, className)} {...props} />;
};
