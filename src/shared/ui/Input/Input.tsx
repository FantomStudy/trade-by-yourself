import type { ComponentProps } from "react";

import { cn } from "@/shared/utils";

import styles from "./Input.module.css";

export const Input = ({
  type = "text",
  className,
  ...props
}: ComponentProps<"input">) => {
  return (
    <input type={type} {...props} className={cn(styles.input, className)} />
  );
};
