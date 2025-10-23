import type { ComponentProps } from "react";

import Image from "next/image";

import { cn } from "@/shared/utils";

import styles from "./Logo.module.css";

export const Logo = ({ className, ...props }: ComponentProps<"div">) => {
  return (
    <div className={cn(styles.logo, className)} {...props}>
      <Image alt="Logo" height={75} src="/logo.png" width={104} priority />
      <span>ТоргуйСам</span>
    </div>
  );
};
