import Link from "next/link";
import { getCurrentUser } from "@/api/auth";
import { Logo } from "../ui";
import { HeaderActions } from "./HeaderActions";
import styles from "./Header.module.css";

export const Header = async () => {
  const user = await getCurrentUser().catch(() => null);

  return (
    <header className={styles.header}>
      <div className="container">
        <div className={styles.wrapper}>
          <Link href="/">
            <Logo />
          </Link>

          <div className={styles.actions}>
            <HeaderActions user={user} />
          </div>
        </div>
      </div>
    </header>
  );
};
