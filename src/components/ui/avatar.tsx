"use client";

import type { VariantProps } from "class-variance-authority";

import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cva } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const avatarVariants = cva(
  "relative flex shrink-0 overflow-hidden rounded-full",
  {
    variants: {
      size: {
        md: "size-10",
        lg: "size-28",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

export interface AvatarProps
  extends React.ComponentProps<typeof AvatarPrimitive.Root>,
    VariantProps<typeof avatarVariants> {}

export const Avatar = ({
  className,
  size,
  ref,
  ...props
}: AvatarProps & {
  ref?: React.Ref<React.ElementRef<typeof AvatarPrimitive.Root>>;
}) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(avatarVariants({ size, className }))}
    data-slot="avatar"
    {...props}
  />
);

export const AvatarImage = ({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>) => {
  return (
    <AvatarPrimitive.Image
      className={cn("aspect-square size-full", className)}
      data-slot="avatar-image"
      {...props}
    />
  );
};

const avatarFallbackVariants = cva(
  "bg-accent flex size-full items-center justify-center rounded-full font-medium",
  {
    variants: {
      size: {
        md: "text-base",
        lg: "text-4xl",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

interface AvatarFallbackProps
  extends React.ComponentProps<typeof AvatarPrimitive.Fallback>,
    VariantProps<typeof avatarFallbackVariants> {}

export const AvatarFallback = ({
  className,
  size,
  ...props
}: AvatarFallbackProps) => {
  return (
    <AvatarPrimitive.Fallback
      className={cn(avatarFallbackVariants({ size, className }))}
      data-slot="avatar-fallback"
      {...props}
    />
  );
};
