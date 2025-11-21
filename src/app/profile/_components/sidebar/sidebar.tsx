"use client";

import { WalletIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { Avatar, Typography } from "@/components/ui";
import { useAuth } from "@/lib/contexts";
import { formatFullName } from "@/lib/format";

import { LINKS } from "./constants";

import styles from "./sidebar.module.css";

export const Sidebar = () => {
  const { user } = useAuth();
  const pathname = usePathname();

  const [profileSettings, setProfileSettings] = useState<{
    isAnswersCall?: boolean | null;
    phoneNumber?: string | null;
    photo?: string | null;
    profileType?: string | null;
  } | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/user/profile-settings`,
          {
            credentials: "include",
          },
        ).then((r) => r.json());
        setProfileSettings(res);
      } catch (err) {
        console.error("Failed to load profile settings for sidebar:", err);
      }
    };

    void load();
  }, []);

  const getProfileTypeLabel = (type?: string | null) => {
    return type === "OOO" ? "Юридическое лицо" : "Физическое лицо";
  };

  const currentProfileType =
    profileSettings?.profileType ?? (user as any)?.profileType;
  const isLegalEntity = currentProfileType === "OOO";

  return (
    <div className={styles.sidebar}>
      {user && (
        <>
          <div className={styles.profileInfo}>
            <Avatar
              fullName={user.fullName}
              size="lg"
              src={profileSettings?.photo ?? (user as any)?.photo ?? ""}
            />
            <Typography variant="h2">
              {formatFullName(user.fullName)}
            </Typography>
            {(profileSettings?.phoneNumber ?? (user as any)?.phoneNumber) && (
              <div className="text-muted-foreground text-sm">
                {profileSettings?.phoneNumber ?? (user as any)?.phoneNumber}
              </div>
            )}
          </div>

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
            />
            <span
              className={
                isLegalEntity
                  ? styles.profileTypeTextLegal
                  : styles.profileTypeTextPhysical
              }
            >
              {getProfileTypeLabel(currentProfileType)}
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
              {group.links.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    href={link.href}
                    key={link.label}
                    className={
                      isActive
                        ? `${styles.link} ${styles.linkActive}`
                        : styles.link
                    }
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
