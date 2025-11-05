import Link from "next/link";

import { WalletIcon } from "@/shared/icons";
import { UserInfo } from "@/shared/ui";

import { links } from "./links";

import styles from "./Sidebar.module.css";

export const Sidebar = () => {
  return (
    <aside className={styles.sidebar}>
      <UserInfo rating={4.7} userName="Николай Петров" reviewsCount={245} />

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
              <Link href={link.href} key={link.href}>
                {link.label}
              </Link>
            ))}
          </div>
        ))}
      </nav>
    </aside>
  );
};
