"use client";

import { Gift, ShieldCheck, StarIcon, WalletIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { useIsAdmin, useUserInfo } from "@/api/hooks";
import { Typography } from "@/components/ui";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/lib/contexts";

import { toShortName } from "@/lib/format";

import { LINKS } from "./constants";
import styles from "./sidebar.module.css";

export const Sidebar = () => {
  const { user } = useAuth();
  const { data: userInfo } = useUserInfo(user?.id);
  const { data: adminCheck } = useIsAdmin();
  const pathname = usePathname();

  const getProfileTypeLabel = (type?: string | null) => {
    if (!type) return "Физическое лицо";
    return type === "OOO" || type === "Юридическое лицо" ? "Юридическое лицо" : "Физическое лицо";
  };

  const isLegalEntity =
    userInfo?.profileType === "OOO" || userInfo?.profileType === "Юридическое лицо";

  return (
    <div className={styles.sidebar}>
      {user && (
        <>
          <div className={styles.profileInfo}>
            <Avatar size="lg" src={userInfo?.photo ?? ""} fallback={user.fullName} />
            <Typography variant="h2">{toShortName(user.fullName)}</Typography>
          </div>

          <div className={styles.stats}>
            <div className={styles.ratingSection}>
              <Typography className={styles.rating}>
                {(userInfo?.rating ?? 0).toFixed(1)}
                <StarIcon fill="currentColor" />
              </Typography>

              <Typography className={styles.reviews}>
                {userInfo?.reviewsCount ?? 0} отзывов
              </Typography>
            </div>

            <div className={isLegalEntity ? styles.profileTypeLegal : styles.profileTypePhysical}>
              <div
                className={
                  isLegalEntity ? styles.profileTypeDotLegal : styles.profileTypeDotPhysical
                }
              />
              <span
                className={
                  isLegalEntity ? styles.profileTypeTextLegal : styles.profileTypeTextPhysical
                }
              >
                {getProfileTypeLabel(userInfo?.profileType)}
              </span>
            </div>
          </div>

          <div className={styles.balanceSection}>
            <span className={styles.balance}>
              <WalletIcon /> {userInfo?.balance ?? 0} ₽
            </span>
            <span className={styles.bonusBalance}>
              <Gift /> {userInfo?.bonusBalance ?? 0} ₽
            </span>
          </div>

          {adminCheck?.isAdmin && (
            <Link href="/admin">
              <Button className={styles.adminButton} variant="success">
                <ShieldCheck size={20} />
                Панель администратора
              </Button>
            </Link>
          )}
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

      <div className={styles.adBanner}>
        <div className={styles.adBannerWrapper}>
          <Image
            src="/ad-banner-megafon.png"
            alt="Реклама"
            width={300}
            height={300}
            className={styles.adBannerImage}
          />
          <div className={styles.adBadge}>
            <span className={styles.adBadgeText}>Реклама</span>
          </div>
        </div>
      </div>
    </div>
  );
};
