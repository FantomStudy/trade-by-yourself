import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

import { Input } from "./input";

interface FieldProps extends ComponentProps<"input"> {
  containerClassName?: string;
  error?: string;
}

export const Field = ({ error, containerClassName, ...props }: FieldProps) => {
  return (
    <div className={cn("flex flex-col gap-2", containerClassName)}>
      <Input {...props} />
      {error && <span className="form-error">{error}</span>}
    </div>
  );
};
