import { Slot } from "@radix-ui/react-slot";
import clsx from "clsx";
import styles from "./Button.module.css";

export interface ButtonProps extends React.ComponentProps<"button"> {
  asChild?: boolean;
  size?: "default" | "icon";
  variant?:
    | "primary"
    | "outline"
    | "success"
    | "destructive"
    | "ghost"
    | "link";
}

export const Button = ({
  asChild = false,
  variant = "primary",
  size = "default",
  className,
  ...props
}: ButtonProps) => {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      className={clsx(styles.button, styles[variant], styles[size], className)}
      {...props}
    />
  );
};
