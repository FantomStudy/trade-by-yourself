import type { ComponentProps } from "react";

import { cn } from "@/shared/utils";

import styles from "./Button.module.css";

interface ButtonProps extends ComponentProps<"button"> {
  color?: "blue" | "green";
  size?: "default" | "icon";
  variant?: "ghost" | "link" | "primary";
}

export const Button = ({
  type = "button",
  color = "blue",
  variant = "primary",
  size = "default",
  children,
  className,
  ...props
}: ButtonProps) => {
  return (
    <button
      type={type}
      className={cn(
        styles.button,
        styles[color],
        styles[variant],
        styles[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
