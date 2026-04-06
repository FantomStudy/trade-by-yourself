import { Slot } from "@radix-ui/react-slot";
import clsx from "clsx";

import styles from "./button.module.css";

export interface ButtonProps extends React.ComponentProps<"button"> {
  asChild?: boolean;
  size?: "default" | "icon-sm" | "icon";
  variant?: "destructive" | "ghost" | "link" | "primary" | "secondary" | "success";
}

export const Button = ({
  variant = "primary",
  size = "default",
  asChild = false,
  className,
  ...props
}: ButtonProps) => {
  const Comp = asChild ? Slot : "button";
  const classes = clsx(styles.button, styles[size], styles[variant], className);

  return <Comp className={classes} data-slot="button" {...props} />;
};
