
import type { ComponentProps } from "react";

import clsx from "clsx";

import styles from "./input.module.css";

export const Input = ({ className, type = "text", ...props }: ComponentProps<"input">) => {
  return (
    <input
      className={clsx(styles.input, className)}
      type={type}
      data-slot="input"
      {...props}
    />
  );
};
