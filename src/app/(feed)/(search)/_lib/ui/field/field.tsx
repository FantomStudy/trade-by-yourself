import type { FieldError as FormFieldError } from "react-hook-form";

import clsx from "clsx";

import styles from "./field.module.css";

export interface FieldRootProps extends React.ComponentProps<"div"> {
  orientation?: "horizontal" | "vertical";
}

const FieldRoot = ({ orientation = "vertical", ...props }: FieldRootProps) => {
  return (
    <div
      className={clsx(styles.field, styles[orientation])}
      data-slot="field"
      role="group"
      {...props}
    />
  );
};

export interface FieldErrorProps extends React.ComponentProps<"div"> {
  error?: FormFieldError;
}

const FieldError = ({ error, className, ...props }: FieldErrorProps) => {
  if (!error) return null;

  return (
    <div
      className={clsx("form-error", className)}
      data-slot="field-error"
      role="alert"
      {...props}
    >
      {error.message}
    </div>
  );
};

export const Field = Object.assign(FieldRoot, {
  Error: FieldError,
});
