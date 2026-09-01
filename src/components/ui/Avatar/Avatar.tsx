import { Avatar as AvatarBase } from "@base-ui/react/avatar";
import clsx from "clsx";
import styles from "./Avatar.module.css";

interface AvatarProps extends AvatarBase.Root.Props {
  src: string | null;
  fallback?: string | null;
  size?: "sm" | "md" | "lg";
}

export const Avatar = ({ size = "md", src, fallback, className, ...props }: AvatarProps) => {
  const initial = fallback && typeof fallback === "string" && fallback.trim().length > 0
    ? fallback.trim()[0].toUpperCase()
    : "П";

  return (
    <AvatarBase.Root className={clsx(styles.root, styles[size], className)} {...props}>
      <AvatarBase.Image src={src ?? ""} className={styles.image} />
      <AvatarBase.Fallback className={styles.fallback}>{initial}</AvatarBase.Fallback>
    </AvatarBase.Root>
  );
};
