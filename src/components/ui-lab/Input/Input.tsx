import clsx from "clsx";
import styles from "./Input.module.css";

export type InputProps = React.ComponentProps<"input">;

export const Input = ({ type = "text", className, ...props }: InputProps) => {
  return (
    <input type={type} className={clsx(styles.input, className)} {...props} />
  );
};
