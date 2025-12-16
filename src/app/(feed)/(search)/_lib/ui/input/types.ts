import type { InputProps } from "./input";

export interface MaskedInputProps extends Omit<InputProps, "type"> {
  value?: string;
}
