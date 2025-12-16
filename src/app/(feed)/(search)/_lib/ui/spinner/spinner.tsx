import clsx from "clsx";
import { Loader2Icon } from "lucide-react";

import styles from "./spinner.module.css";

function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <Loader2Icon
      aria-label="Loading"
      className={clsx(styles.spinner, className)}
      role="status"
      {...props}
    />
  );
}
export { Spinner };
