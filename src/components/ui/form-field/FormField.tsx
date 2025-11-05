import type { ComponentProps } from "react";

import clsx from "clsx";

import { Input } from "@/components/ui";

import styles from "./FormField.module.css";

interface FormFieldProps extends ComponentProps<"input"> {
  containerClassName?: string;
  error?: string;
}

export const FormField = ({
  error,
  containerClassName,
  ...props
}: FormFieldProps) => {
  return (
    <div className={clsx(styles.container, containerClassName)}>
      <Input {...props} />
      {error && <p className={clsx(styles.error, "text-danger")}>{error}</p>}
    </div>
  );
};
