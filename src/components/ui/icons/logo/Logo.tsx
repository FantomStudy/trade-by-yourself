import type { ComponentProps } from "react";

import clsx from "clsx";
import Image from "next/image";

import styles from "./Logo.module.css";

interface LogoProps extends ComponentProps<"div"> {
  hideText?: boolean;
}

export const Logo = ({ className, hideText = false, ...props }: LogoProps) => {
  return (
    <div className={clsx(styles.logo, className)} {...props}>
      <Image alt="Logo" height={75} src="/logo.png" width={104} priority />
      {!hideText && <span>ТоргуйСам</span>}
    </div>
  );
};
