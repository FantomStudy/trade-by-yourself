import Image from "next/image";
import styles from "./Logo.module.css";
import { ComponentProps } from "react";
import { cn } from "@/utils";

export const Logo = ({ className, ...props }: ComponentProps<"div">) => {
  return (
    <div className={cn(styles.logo, className)} {...props}>
      <Image src="/logo.png" alt="Logo" width={104} height={75} priority />
      <span>ТоргуйСам</span>
    </div>
  );
};
