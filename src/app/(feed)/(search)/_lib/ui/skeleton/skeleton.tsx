import clsx from "clsx";

import styles from "./skeleton.module.css";

export const Skeleton = ({ className }: React.ComponentProps<"div">) => {
  return (
    <div className={clsx(styles.skeleton, className)} data-slot="skeleton" />
  );
};
