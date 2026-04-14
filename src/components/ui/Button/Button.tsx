"use client";

import { Button as ButtonBase } from "@base-ui/react/button";
import clsx from "clsx";
import styles from "./Button.module.css";

export interface ButtonProps extends ButtonBase.Props {
  size?: "md" | "sm" | "icon" | "icon-sm";
  variant?: "primary" | "outline" | "success" | "danger" | "ghost" | "link";
}

export const Button = ({ variant = "primary", size = "md", className, ...props }: ButtonProps) => {
  return (
    <ButtonBase
      type="button"
      className={clsx(styles.button, styles[variant], styles[size], className)}
      {...props}
    />
  );
};
