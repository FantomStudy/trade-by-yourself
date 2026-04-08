import Link from "next/link";
import { Logo } from "../ui";
import { HeaderActions } from "./HeaderActions";
import { MobileMenu } from "./MobileMenu";
import { SearchCollapse } from "./SearchCollapse";
import styles from "./Header.module.css";

export const Header = () => {
  return (
    <header className={styles.header}>
      <div className="global-container">
        <div className={styles.wrapper}>
          <Link href="/">
            <Logo />
          </Link>

          <div className={styles.rightSection}>
            <SearchCollapse />
            <div className={styles.desktopActions}>
              <HeaderActions />
            </div>
            <MobileMenu />
          </div>
        </div>
      </div>
    </header>
  );
};
