"use client";

import * as AvatarPrimitive from "@radix-ui/react-avatar";
import clsx from "clsx";
import styles from "./Avatar.module.css";

type AvatarSize = "lg" | "md";

export interface AvatarProps extends AvatarPrimitive.AvatarProps {
  fullName: string;
  size?: AvatarSize;
  src?: string;
}

export const Avatar = ({
  size = "md",
  fullName,
  className,
  src,
}: AvatarProps) => {
  return (
    <AvatarPrimitive.Root
      className={clsx(styles.avatar, styles[size], className)}
    >
      <AvatarPrimitive.Image alt="" className={styles.image} src={src} />
      <AvatarPrimitive.Fallback className={styles.fallback}>
        {fullName.charAt(0).toUpperCase()}
      </AvatarPrimitive.Fallback>
    </AvatarPrimitive.Root>
  );
};
