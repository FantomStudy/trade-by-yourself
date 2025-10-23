import styles from "./Avatar.module.css";

interface AvatarProps {
  size?: number;
  src?: string;
}

export const Avatar = ({ src, size = 100 }: AvatarProps) => {
  return (
    <div
      style={{
        width: size,
        height: size,
        backgroundImage: src && `url(${src})`,
      }}
      className={styles.avatar}
    />
  );
};
