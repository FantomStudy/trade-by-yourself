import Image from "next/image";
import { Typography } from "../typography/typography";
import styles from "./Logo.module.css";

interface LogoProps {
  hiddenText?: boolean;
}

export const Logo = ({ hiddenText = false }: LogoProps) => {
  return (
    <div className={styles.logo}>
      <Image alt="Logo" height={49} src="/3-b.png" width={68} priority />
      {!hiddenText && <Typography variant="h2">ТоргуйСам</Typography>}
    </div>
  );
};
