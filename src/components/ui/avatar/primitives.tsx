"use client";

import * as AvatarPrimitive from "@radix-ui/react-avatar";
import clsx from "clsx";

import styles from "./primitives.module.css";

type AvatarSize = "lg" | "md";

export interface AvatarRootProps extends AvatarPrimitive.AvatarProps {
  size?: AvatarSize;
}

export const AvatarRoot = ({
  size = "md",
  className,
  ...props
}: AvatarRootProps) => {
  return (
    <AvatarPrimitive.Root
      className={clsx(styles.avatar, styles[size], className)}
      data-slot="avatar"
      {...props}
    />
  );
};

export const AvatarImage = ({
  className,
  ...props
}: AvatarPrimitive.AvatarImageProps) => {
  return (
    <AvatarPrimitive.Image
      className={clsx(styles.avatarImage, className)}
      data-slot="avatar-image"
      {...props}
    />
  );
};

export const AvatarFallback = ({
  className,
  ...props
}: AvatarPrimitive.AvatarFallbackProps) => {
  return (
    <AvatarPrimitive.Fallback
      className={clsx(styles.fallback, className)}
      data-slot="avatar-fallback"
      {...props}
    />
  );
};
