import type { IMaskInputProps } from "react-imask";
import clsx from "clsx";
import { IMaskInput } from "react-imask";
import styles from "./Input.module.css";

export type InputMaskProps = IMaskInputProps<HTMLInputElement>;

export const InputMask = ({ className, ...props }: InputMaskProps) => {
  return <IMaskInput className={clsx(styles.input, className)} {...props} />;
};
