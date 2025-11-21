"use client";

import { WalletIcon } from "lucide-react";
import Link from "next/link";

import { Avatar, Typography } from "@/components/ui";
import { useAuth } from "@/lib/contexts";
import { formatFullName } from "@/lib/format";

import { LINKS } from "./constants";

import styles from "./sidebar.module.css";

export const Sidebar = () => {
  const { user } = useAuth();

  const getProfileTypeLabel = (type: string) => {
    return type === "OOO" ? "Юридическое лицо" : "Физическое лицо";
  };

  const isLegalEntity = user?.profileType === "OOO";

  return (
    <div className={styles.sidebar}>
      {user && (
        <>
          <div className={styles.profileInfo}>
            <Avatar fullName={user.fullName} size="lg" src="" />
            <Typography variant="h2">
              {formatFullName(user.fullName)}
            </Typography>
          </div>

          {/* Бейдж типа профиля */}
          <div
            className={
              isLegalEntity
                ? styles.profileTypeLegal
                : styles.profileTypePhysical
            }
          >
            <div
              className={
                isLegalEntity
                  ? styles.profileTypeDotLegal
                  : styles.profileTypeDotPhysical
              }
            ></div>
            <span
              className={
                isLegalEntity
                  ? styles.profileTypeTextLegal
                  : styles.profileTypeTextPhysical
              }
            >
              {getProfileTypeLabel(user.profileType)}
            </span>
          </div>

          <span className={styles.balance}>
            <WalletIcon /> ₽
          </span>
        </>
      )}

      <nav className={styles.nav}>
        {LINKS.map((group) => (
          <div key={group.id} className={styles.group}>
            {group.name && <Typography variant="h2">{group.name}</Typography>}

            <div className={styles.groupLinks}>
              {group.links.map((link) => (
                <Link href={link.href} key={link.label} className={styles.link}>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </nav>
    </div>
  );
};
