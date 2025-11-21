import type { ComponentProps } from "react";

import { Slot } from "@radix-ui/react-slot";
import clsx from "clsx";

import styles from "./button.module.css";

export type ButtonVariant =
  | "default"
  | "destructive"
  | "ghost"
  | "link"
  | "secondary";
  
type ButtonSize = "default" | "icon";

interface ButtonProps extends ComponentProps<"button"> {
  asChild?: boolean;
  size?: ButtonSize;
  variant?: ButtonVariant;
}

const sizeStyles: Record<ButtonSize, string> = {
  default: styles.sizeDefault,
  icon: styles.sizeIcon,
};

export const Button = ({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: ButtonProps) => {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      className={clsx(
        styles.button,
        styles[variant],
        sizeStyles[size],
        className,
      )}
      data-slot="button"
      {...props}
    />
  );
};
