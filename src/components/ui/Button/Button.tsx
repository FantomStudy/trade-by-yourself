import { Slot } from "@radix-ui/react-slot";
import clsx from "clsx";

import styles from "./Button.module.css";

type ButtonVariant =
  | "destructive"
  | "ghost"
  | "link"
  | "primary-green"
  | "primary";
//   | "secondary";

type ButtonSize = "default" | "icon";

interface ButtonProps extends React.ComponentProps<"button"> {
  asChild?: boolean;
  size?: ButtonSize;
  variant?: ButtonVariant;
}

export const Button = ({
  className,
  asChild = false,
  size = "default",
  variant = "primary",
  ...props
}: ButtonProps) => {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      className={clsx(styles.button, styles[size], styles[variant], className)}
      data-slot="button"
      {...props}
    />
  );
};
