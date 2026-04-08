import clsx from "clsx";
import styles from "./Textarea.module.css";

export const Textarea = ({ className, ...props }: React.ComponentProps<"textarea">) => {
  return <textarea className={clsx(styles.textarea, className)} {...props} />;
};
