"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Typography } from "@/components/ui";
import { LINKS } from "./constants";
import styles from "./NavBar.module.css";

export const NavBar = () => {
  const pathname = usePathname();

  return (
    <nav className={styles.nav}>
      {LINKS.map((section) => (
        <div key={section.id} className={styles.section}>
          {section.name && <Typography variant="h2">{section.name}</Typography>}

          <div className={styles.links}>
            {section.links.map((link) => {
              const isActive = pathname === link.href;

              return (
                <Link
                  href={link.href}
                  key={link.label}
                  className={isActive ? `${styles.link} ${styles.linkActive}` : styles.link}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
};
