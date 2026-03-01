import clsx from "clsx";
import Link from "next/link";
import { Logo } from "../ui-lab/Logo";
import { HeaderActions } from "./HeaderActions";
import { MobileMenu } from "./MobileMenu";
import { SearchButton } from "./SearchButton";
import styles from "./Header.module.css";

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
