import Image from "next/image";
import styles from "./Logo.module.css";

interface LogoProps {
  hiddenText?: boolean;
}

export const Logo = ({ hiddenText = false }: LogoProps) => {
  return (
    <div className={styles.logo}>
      <Image src="/logo.png" alt="Logo" width={58} height={50} priority />
      {!hiddenText && <span className={styles.text}>ТоргуйСам</span>}
    </div>
  );
};
