import type { MaskedInputProps } from "./types";

import { InputMask } from "./input-mask";

export const InputPhone = (props: MaskedInputProps) => {
  return (
    <InputMask
      mask="+7 (___) ___-__-__"
      maxLength={18}
      type="tel"
      placeholder="Номер телефона"
      {...props}
    />
  );
};
