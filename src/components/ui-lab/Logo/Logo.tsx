import Image from "next/image";
import styles from "./Logo.module.css";

export interface LogoProps {
  hiddenText?: boolean;
}

export const Logo = ({ hiddenText = false }: LogoProps) => {
  return (
    <div className={styles.logo}>
      <Image alt="" height={50} src="/3-b.png" width={70} priority />
      {!hiddenText && <span>ТоргуйСам</span>}
    </div>
  );
};
