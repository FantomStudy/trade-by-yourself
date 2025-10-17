import { UserInfo } from "@/components/ui";
import styles from "./Sidebar.module.css";
import { WalletIcon } from "@/components/icons";
import Link from "next/link";
import { links } from "./links";

export const Sidebar = () => {
  return (
    <aside className={styles.sidebar}>
      <UserInfo userName="Николай Петров" rating={4.7} reviewsCount={245} />

      <span className={styles.wallet}>
        <WalletIcon /> 3000 ₽
      </span>

      <nav className={styles.navigation}>
        {links.map((linkGroup) => (
          <div key={linkGroup.id} className={styles.navGroup}>
            {Boolean(linkGroup.group) && (
              <h2 className={styles.navTitle}>{linkGroup.group}</h2>
            )}

            {linkGroup.items.map((link) => (
              <Link key={link.href} href={link.href}>
                {link.label}
              </Link>
            ))}
          </div>
        ))}
      </nav>
    </aside>
  );
};
