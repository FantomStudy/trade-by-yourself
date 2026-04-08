import Image from "next/image";

import { Typography } from "../typography/typography";

import styles from "./logo.module.css";

interface LogoProps {
  hiddenText?: boolean;
}

export const Logo = ({ hiddenText = false }: LogoProps) => {
  return (
    <div className={styles.root}>
      <Image alt="Logo" height={49} src="/logo.png" width={68} priority />
      {!hiddenText && <Typography variant="h2">ТоргуйСам</Typography>}
    </div>
  );
};
