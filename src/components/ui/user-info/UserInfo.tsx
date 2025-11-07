import { formatToInitials } from "@/lib/utils";

import { Avatar } from "../avatar/Avatar";

import styles from "./UserInfo.module.css";

interface UserInfoProps {
  avatarUrl?: string;
  fullName: string;
  profileType: string;
}

export const UserInfo = ({
  fullName,
  profileType,
  avatarUrl,
}: UserInfoProps) => {
  return (
    <div className={styles.info}>
      <Avatar name={fullName} src={avatarUrl} />
      <p className={styles.name}>{formatToInitials(fullName)}</p>
      {/* {Boolean(rating && reviewsCount) && (
        <div className={styles.stats}>
          <span className={styles.rating}>
            {rating}
            <StarIcon />
          </span>

          <span>{reviewsCount} отзывов</span>
        </div>
      )} */}
      <p>{profileType}</p>
    </div>
  );
};
