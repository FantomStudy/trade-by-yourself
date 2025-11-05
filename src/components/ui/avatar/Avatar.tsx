import type { ComponentProps } from "react";

import clsx from "clsx";

import styles from "./Avatar.module.css";

interface AvatarProps extends ComponentProps<"div"> {
  name?: string;
  src?: string;
}

const avatarColors = [
  "var(--green)",
  "var(--blue)",
  "var(--purple)",
  "var(--pink)",
  "var(--red)",
  "var(--orange)",
];

const getColorFromName = (name: string) => {
  if (!name) return avatarColors[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  const index = Math.abs(hash) % avatarColors.length;
  return avatarColors[index];
};

const getInitials = (name: string) => {
  const parts = name.trim().split(" ");
  if (parts.length === 0) return "";
  // if (parts.length === 1) return parts[0][0].toUpperCase();
  // return (parts[0][0] + parts[1][0]).toUpperCase();
};

export const Avatar = ({
  name = "",
  src,
  className,
  ...props
}: AvatarProps) => {
  return (
    <div className={clsx(styles.avatar, className)} {...props}>
      {src ? (
        <img alt="avatar" className={styles.avatarImage} src={src} />
      ) : (
        <div
          className={styles.avatarFallback}
          style={{ backgroundColor: getColorFromName(name) }}
        >
          {getInitials(name)}
        </div>
      )}
    </div>
  );
};
