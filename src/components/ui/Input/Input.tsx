import { ComponentProps } from "react";
import styles from "./Input.module.css";
import { cn } from "@/utils";

export const Input = ({
  type = "text",
  className,
  ...props
}: ComponentProps<"input">) => {
  return (
    <input type={type} {...props} className={cn(styles.input, className)} />
  );
};
