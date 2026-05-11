import { Avatar as AvatarBase } from "@base-ui/react/avatar";
import clsx from "clsx";
import styles from "./Avatar.module.css";

interface AvatarProps extends AvatarBase.Root.Props {
  src: string | null;
  fallback: string;
  size?: "sm" | "md" | "lg";
}

export const Avatar = ({ size = "md", src, fallback, className, ...props }: AvatarProps) => {
  return (
    <AvatarBase.Root className={clsx(styles.root, styles[size], className)} {...props}>
      <AvatarBase.Image src={src ?? ""} className={styles.image} />
      <AvatarBase.Fallback className={styles.fallback}>{fallback[0]}</AvatarBase.Fallback>
    </AvatarBase.Root>
  );
};
