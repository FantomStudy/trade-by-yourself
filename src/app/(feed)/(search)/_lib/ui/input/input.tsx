import clsx from "clsx";

import styles from "./input.module.css";

export type InputProps = React.ComponentProps<"input">;

export const Input = ({ type = "text", className, ...props }: InputProps) => {
  return <input className={clsx(styles.input, className)} type={type} {...props} />;
};
