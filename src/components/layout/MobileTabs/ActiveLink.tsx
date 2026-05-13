"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./MobileTabs.module.css";

export const ActiveLink = ({ href, ...props }: React.ComponentProps<typeof Link>) => {
  const pathname = usePathname();

  return <Link href={href} className={styles.link} data-active={href === pathname} {...props} />;
};
