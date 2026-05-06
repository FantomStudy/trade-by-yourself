import clsx from "clsx";
import styles from "./BannerSlot.module.css";

export const BannerBadge = ({ className, ...props }: React.ComponentProps<"span">) => {
  return (
    <span className={clsx(styles.badge, className)} {...props}>
      Реклама
    </span>
  );
};
