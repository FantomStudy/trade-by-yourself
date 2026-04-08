import { GiftIcon, ShieldCheckIcon, StarIcon, WalletIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { checkIsAdmin, getCurrentUser } from "@/api/auth";
import { getUser } from "@/api/users/getUser";
import { Avatar, Button, Typography } from "@/components/ui";
import { toShortName } from "@/lib/format";
import { NavBar } from "./_components/NavBar";
import styles from "./layout.module.css";

const ProfileLayout = async ({ children }: LayoutProps<"/profile">) => {
  const { id } = await getCurrentUser();
  const user = await getUser(id);
  const { isAdmin } = await checkIsAdmin();

  const getProfileTypeLabel = (type?: string | null) => {
    if (!type) return "Физическое лицо";
    return type === "OOO" || type === "Юридическое лицо" ? "Юридическое лицо" : "Физическое лицо";
  };

  const isLegalEntity = user.profileType === "OOO" || user.profileType === "Юридическое лицо";

  return (
    <div className="global-container">
      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          <div className={styles.user}>
            <Avatar size="lg" src={user.photo} fallback={user.fullName[0]} />
            <Typography>{toShortName(user.fullName)}</Typography>
          </div>

          <div className={styles.meta}>
            <div className={styles.rating}>
              <Typography className={styles.score}>
                {(user.rating ?? 0).toFixed(1)}
                <StarIcon fill="currentColor" />
              </Typography>

              <Typography className={styles.reviews}>{user.reviewsCount ?? 0} отзывов</Typography>
            </div>

            <div
              className={`${styles.badge} ${
                isLegalEntity ? styles.badgeLegal : styles.badgePersonal
              }`}
            >
              <div className={isLegalEntity ? styles.dotLegal : styles.dotPersonal} />
              <span className={isLegalEntity ? styles.textLegal : styles.textPersonal}>
                {getProfileTypeLabel(user.profileType)}
              </span>
            </div>
          </div>

          <div className={styles.balances}>
            <span className={styles.balance}>
              <WalletIcon /> {user.balance ?? 0} ₽
            </span>
            <span className={styles.bonus}>
              <GiftIcon /> {user.bonusBalance ?? 0} ₽
            </span>
          </div>

          {isAdmin && (
            <Button variant="success" className={styles.admin} render={<Link href="/admin" />}>
              <ShieldCheckIcon />
              Панель администратора
            </Button>
          )}

          <NavBar />

          <div className={styles.promo}>
            <div className={styles.promoMedia}>
              <Image
                src="/ad-banner-megafon.png"
                alt="Реклама"
                width={300}
                height={300}
                className={styles.promoImage}
              />
              <div className={styles.promoBadge}>
                <span className={styles.promoBadgeText}>Реклама</span>
              </div>
            </div>
          </div>
        </aside>

        {children}
      </div>
    </div>
  );
};

export default ProfileLayout;
