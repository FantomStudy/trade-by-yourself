import { Input as InputBase } from "@base-ui/react/input";
import clsx from "clsx";
import styles from "./Input.module.css";

export const Input = ({ className, ...props }: InputBase.Props) => {
  return <InputBase className={clsx(styles.input, className)} {...props} />;
};
