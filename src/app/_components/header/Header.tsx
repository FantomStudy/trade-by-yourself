import Link from "next/link";

import { Logo } from "@/components/ui";

import { HeaderActionsWrapper } from "./HeaderActionsWrapper";

import styles from "./Header.module.css";

export const Header = () => {
  return (
    <header className={styles.header}>
      <div className="container">
        <div className={styles.headerWrapper}>
          <Link href="/">
            <Logo className={styles.logo} />
          </Link>

          <HeaderActionsWrapper />
        </div>
      </div>
    </header>
  );
};
