import type { ComponentProps } from "react";

import clsx from "clsx";

import { Input } from "../input/input";

import styles from "./field.module.css";

interface FieldProps extends ComponentProps<"input"> {
  containerClassName?: string;
  error?: string;
}

export const Field = ({ error, containerClassName, ...props }: FieldProps) => {
  return (
    <div className={clsx(styles.container, containerClassName)}>
      <Input {...props} />
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
};
