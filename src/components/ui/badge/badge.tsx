import type { ComponentProps } from "react";

import { Slot } from "@radix-ui/react-slot";
import clsx from "clsx";

import styles from "./badge.module.css";

interface BadgeProps extends ComponentProps<"span"> {
  asChild?: boolean;
  variant?: "primary" | "secondary";
}

export const Badge = ({
  className,
  variant = "primary",
  asChild = false,
  ...props
}: BadgeProps) => {
  const Comp = asChild ? Slot : "span";
  return (
    <Comp
      className={clsx(styles.badge, styles[variant], className)}
      data-slot="badge"
      {...props}
    />
  );
};
