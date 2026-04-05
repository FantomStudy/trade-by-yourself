import clsx from "clsx";
import styles from "./Grid.module.css";

export const Grid = ({ className, ...props }: React.ComponentProps<"div">) => {
  return <div className={clsx(styles.grid, className)} {...props} />;
};
