import clsx from "clsx";
import Link from "next/link";

import { Logo } from "@/components/ui";

import { HeaderActions } from "./header-actions";

import styles from "./header.module.css";

export const Header = () => {
  return (
    <header className={styles.header}>
      <div className={clsx("global-container", styles.wrapper)}>
        <Link href="/">
          <Logo />
        </Link>

        <HeaderActions />
      </div>
    </header>
  );
};
