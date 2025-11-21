import type { ReactNode } from "react";

import clsx from "clsx";

import styles from "./typography.module.css";

interface TypographyProps {
  children?: ReactNode;
  className?: string;
  variant?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span";
}

export const Typography = ({
  variant = "p",
  children,
  className,
}: TypographyProps) => {
  const Comp = variant;

  return <Comp className={clsx(styles[variant], className)}>{children}</Comp>;
};
