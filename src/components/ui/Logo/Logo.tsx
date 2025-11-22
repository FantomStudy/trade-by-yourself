import Image from "next/image";

import { Typography } from "../Typography/Typography";

import styles from "./Logo.module.css";

interface LogoProps {
  hiddenText?: boolean;
}

export const Logo = ({ hiddenText = false }: LogoProps) => {
  return (
    <div className={styles.logo}>
      <Image alt="Логотип" height={49} src="/logo.png" width={68} priority />
      {!hiddenText && <Typography variant="h2">ТоргуйСам</Typography>}
    </div>
  );
};
