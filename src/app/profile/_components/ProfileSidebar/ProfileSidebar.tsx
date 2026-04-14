"use client";

import type { CurrentUser } from "@/api/users";
import { GiftIcon, ShieldCheckIcon, StarIcon, WalletIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar, Button } from "@/components/ui";
import { toShortName } from "@/lib/format";
import { LINK_GROUPS } from "./constants";
import styles from "./ProfileSidebar.module.css";

const getProfileTypeLabel = (type?: string | null) => {
  if (!type) return "Физическое лицо";
  return type === "OOO" ? "Юридическое лицо" : "Физическое лицо";
};

export const ProfileSidebar = ({ user }: { user: CurrentUser }) => {
  const pathname = usePathname();

  return (
    <div className={styles.sidebar}>
      <div className={styles.user}>
        <Avatar size="lg" src={user.photo ?? ""} fallback={user.fullName?.[0] ?? "?"} />
        <p className={styles.name}>{user ? toShortName(user.fullName) : "Личный кабинет"}</p>
      </div>

      {user && (
        <>
          <div className={styles.meta}>
            <div className={styles.rating}>
              <p className={styles.score}>
                {(user.rating ?? 0).toFixed(1)}
                <StarIcon fill="currentColor" />
              </p>

              {/* <p className={styles.reviews}>{user?.reviewsCount ?? 0} отзывов</p> */}
            </div>

            <span className={styles.badge}>{getProfileTypeLabel(user.profileType)}</span>
          </div>

          <div className={styles.balances}>
            <span>
              <WalletIcon /> 0 ₽
            </span>
            <span>
              <GiftIcon /> 0 ₽
            </span>
          </div>
        </>
      )}

      {user?.role === "admin" && (
        <Button variant="success" nativeButton={false} render={<Link href="/admin" />}>
          <ShieldCheckIcon />
          Панель администратора
        </Button>
      )}

      <nav className={styles.nav}>
        {LINK_GROUPS.map((section) => (
          <div key={section.name} className={styles.section}>
            <p>{section.name}</p>
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
    </div>
  );
};
