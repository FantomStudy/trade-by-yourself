import type { ProductUser } from "@/api/products";
import { CircleSmallIcon, StarIcon } from "lucide-react";
import Link from "next/link";
import { Typography } from "@/components/ui";
import { toShortName } from "@/lib/format";
import { PhoneButton } from "./PhoneButton";
import styles from "./UserCard.module.css";
import { Avatar } from "@/components/ui/lab/Avatar";

interface UserCardProps {
  user: ProductUser;
}

export const UserCard = ({ user }: UserCardProps) => {
  const isLegalEntity = user.profileType === "Юридическое лицо";

  return (
    <div className={styles.card}>
      <Link href={`/seller/${user.id}`} className={styles.userHeader}>
        <Avatar size="lg" src={user.photo} fallback={user.fullName[0]} />
        <Typography variant="h2">{toShortName(user.fullName)}</Typography>
      </Link>

      <div className={styles.userStats}>
        <div className={styles.rating}>
          <Typography className={styles.ratingValue}>
            {user.rating?.toFixed(1) || "0.0"}
            <StarIcon fill="currentColor" />
          </Typography>
          <Typography className={styles.reviewsCount}>{user.reviewsCount || 0} отзывов</Typography>
        </div>
        <span className={styles.profileBadge} data-legal={isLegalEntity}>
          <CircleSmallIcon fill="currentColor" />
          {user.profileType}
        </span>
      </div>

      <div className={styles.userActions}>
        <PhoneButton phoneNumber={user.phoneNumber} />
      </div>
    </div>
  );
};
