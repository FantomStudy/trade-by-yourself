"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./MobileTabs.module.css";

export const ActiveLink = ({ href, ...props }: React.ComponentProps<typeof Link>) => {
  const pathname = usePathname();
  const hrefStr = String(href);
  const isActive =
    hrefStr === "/"
      ? pathname === "/"
      : hrefStr === "/profile/settings"
        ? pathname.startsWith("/profile") &&
          !["/profile/favorites", "/profile/my-products", "/profile/messages"].some((p) =>
            pathname.startsWith(p),
          )
        : pathname === hrefStr || pathname.startsWith(`${hrefStr}/`);

  return <Link href={href} className={styles.link} data-active={isActive} {...props} />;
};
