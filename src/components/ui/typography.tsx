import type { VariantProps } from "class-variance-authority";
import type { ReactNode } from "react";

import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const typographyVariant = cva("", {
  variants: {
    variant: {
      p: "text-base",
      span: "text-base",
      h1: "text-3xl font-medium",
      h2: "text-2xl font-medium",
      h3: "text-xl font-medium",
      h4: "text-lg font-medium",
      h5: "text-md font-medium",
      h6: "text-sm font-medium",
    },
  },
  defaultVariants: {
    variant: "p",
  },
});

interface TypographyProps extends VariantProps<typeof typographyVariant> {
  children: ReactNode;
  className?: string;
}

export const Typography = ({
  variant,
  children,
  className,
}: TypographyProps) => {
  const Comp = variant || "p";

  return (
    <Comp className={cn(typographyVariant({ variant }), className)}>
      {children}
    </Comp>
  );
};
