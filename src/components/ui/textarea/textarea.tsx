import clsx from "clsx";
import * as React from "react";

import styles from "./textarea.module.css";

export const Textarea = ({
  className,
  ...props
}: React.ComponentProps<"textarea">) => {
  return (
    <textarea
      className={clsx(styles.textarea, className)}
      data-slot="textarea"
      {...props}
    />
  );
};
