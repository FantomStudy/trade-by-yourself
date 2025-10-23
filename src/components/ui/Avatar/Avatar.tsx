import styles from "./Avatar.module.css";

interface AvatarProps {
  src?: string;
  size?: number;
}

export const Avatar = ({ src, size = 100 }: AvatarProps) => {
  return (
    <div
      className={styles.avatar}
      style={{
        width: size,
        height: size,
        backgroundImage: src && `url(${src})`,
      }}
    />
  );
};
