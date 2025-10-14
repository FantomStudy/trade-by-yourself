import Image from "next/image";
import styles from "./Avatar.module.css";
import { cn } from "@/utils";

interface AvatarProps {
  src?: string;
  size?: number;
}

export const Avatar = ({ src, size = 50 }: AvatarProps) => {
  return (
    <div
      className={styles.avatar}
      style={{
        width: size,
        height: size,
      }}
    >
      {src ? (
        <Image
          src={src}
          alt={src}
          width={255}
          height={255}
          objectFit="contain"
          objectPosition="center"
        />
      ) : (
        <div className={cn(styles.fallback)} />
      )}
    </div>
  );
};
