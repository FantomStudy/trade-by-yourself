import clsx from "clsx";

import styles from "./typography.module.css";

type TypographyTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span";

export type TypographyProps<T extends TypographyTag = "p"> = {
  variant?: T;
} & React.ComponentProps<T>;

export const Typography = <T extends TypographyTag = "p">({
  variant = "p" as T,
  className,
  ...props
}: TypographyProps<T>) => {
  const Comp = variant as React.ElementType;

  return <Comp className={clsx(styles[variant], className)} {...props} />;
};
