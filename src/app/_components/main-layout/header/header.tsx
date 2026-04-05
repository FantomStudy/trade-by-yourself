"use client";

import clsx from "clsx";
import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { HeaderActions } from "./header-actions";
import { MobileMenu } from "./mobile-menu";
import { SearchButton } from "./search-button";
import styles from "./header.module.css";

export const Header = () => {
  return (
    <header className={styles.header}>
      <div className={clsx("global-container", styles.wrapper)}>
        <Link href="/">
          <Logo />
        </Link>

        <div className={styles.rightSection}>
          <SearchButton />
          <div className={styles.desktopActions}>
            <HeaderActions />
          </div>
          <MobileMenu />
        </div>
      </div>
    </header>
  );
};
