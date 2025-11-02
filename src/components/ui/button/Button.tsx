import type { ComponentProps } from "react";

import clsx from "clsx";

import styles from "./Button.module.css";

interface ButtonProps extends ComponentProps<"button"> {
  color?: "blue" | "green";
  size?: "default" | "icon";
  variant?: "ghost" | "link" | "primary";
}

export const Button = ({
  color = "blue",
  type = "button",
  size = "default",
  variant = "primary",
  className,
  children,
  ...props
}: ButtonProps) => {
  const classNames = clsx(
    styles.button,
    styles[variant],
    styles[color],
    styles[size],
    className
  );

  return (
    <button type={type} className={classNames} {...props}>
      {children}
    </button>
  );
};
