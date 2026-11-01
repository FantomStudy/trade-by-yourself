import { Avatar as AvatarBase } from "@base-ui/react/avatar";
import clsx from "clsx";
import { UserRoundIcon } from "lucide-react";
import React from "react";
import styles from "./Avatar.module.css";

interface AvatarProps extends Omit<AvatarBase.Root.Props, "children"> {
  src?: string | null;
  fallback?: React.ReactNode;
  size?: "sm" | "md" | "lg";
}

export function cleanPhotoUrl(url?: string | null): string {
  if (!url) return "";
  let clean = url.trim();
  while (clean.startsWith("https://torguisam.ru/apihttp") || clean.startsWith("http://torguisam.ru/apihttp")) {
    clean = clean.replace(/^https?:\/\/torguisam\.ru\/api/, "");
  }
  return clean;
}

export const Avatar = ({ size = "md", src, fallback, className, ...props }: AvatarProps) => {
  let content = fallback;
  if (typeof fallback === "string") {
    const trimmed = fallback.trim();
    content = trimmed.length > 0 ? trimmed[0].toUpperCase() : null;
  }
  if (!content) {
    content = <UserRoundIcon className="h-3.5 w-3.5 text-gray-500" />;
  }

  const cleanSrc = cleanPhotoUrl(src);

  return (
    <AvatarBase.Root className={clsx(styles.root, styles[size], className)} {...props}>
      {cleanSrc ? <AvatarBase.Image src={cleanSrc} className={styles.image} /> : null}
      <AvatarBase.Fallback className={styles.fallback}>{content}</AvatarBase.Fallback>
    </AvatarBase.Root>
  );
};
