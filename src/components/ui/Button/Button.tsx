import { ComponentProps } from "react";
import styles from "./Button.module.css";
import { cn } from "@/utils";

interface ButtonProps extends ComponentProps<"button"> {
  color?: "blue" | "green";
}

export const Button = ({
  color = "blue",
  children,
  className,
  ...props
}: ButtonProps) => {
  return (
    <button className={cn(styles.button, styles[color], className)} {...props}>
      {children}
    </button>
  );
};
