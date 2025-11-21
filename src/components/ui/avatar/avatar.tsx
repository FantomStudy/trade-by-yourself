"use client";

import * as AvatarPrimitive from "@radix-ui/react-avatar";
import clsx from "clsx";
import * as React from "react";

import styles from "./avatar.module.css";

interface AvatarProps
  extends React.ComponentProps<typeof AvatarPrimitive.Root> {
  size?: "lg" | "md";
}

const AvatarRoot = ({ ref, size = "md", className, ...props }: AvatarProps) => {
  const sizeClass = size === "md" ? styles.md : styles.lg;
  return (
    <AvatarPrimitive.Root
      ref={ref}
      className={clsx(styles.avatar, sizeClass, className)}
      data-slot="avatar"
      {...props}
    />
  );
};

interface AvatarImageProps
  extends React.ComponentProps<typeof AvatarPrimitive.Image> {}

const AvatarImage = ({ className, ...props }: AvatarImageProps) => {
  return (
    <AvatarPrimitive.Image
      className={clsx(styles.avatarImage, className)}
      data-slot="avatar-image"
      {...props}
    />
  );
};

interface AvatarFallbackProps
  extends React.ComponentProps<typeof AvatarPrimitive.Fallback> {
  size?: "lg" | "md";
}

const AvatarFallback = ({
  size = "md",
  className,
  ...props
}: AvatarFallbackProps) => {
  const textClass =
    size === "md" ? styles.fallbackTextMd : styles.fallbackTextLg;

  return (
    <AvatarPrimitive.Fallback
      className={clsx(styles.avatarFallback, textClass, className)}
      data-slot="avatar-fallback"
      {...props}
    />
  );
};

export type { AvatarProps };
export { AvatarFallback, AvatarImage, AvatarRoot };
