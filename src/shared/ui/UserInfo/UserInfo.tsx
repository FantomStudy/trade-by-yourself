import { StarIcon } from "@/shared/icons";

import { Avatar } from "../Avatar/Avatar";

import styles from "./UserInfo.module.css";

interface UserInfoProps {
  rating?: number;
  reviewsCount?: number;
  userName?: string;
}

export const UserInfo = ({ userName, rating, reviewsCount }: UserInfoProps) => {
  return (
    <div className={styles.info}>
      <Avatar size={112} />
      <p className={styles.name}>{userName}</p>
      {Boolean(rating && reviewsCount) && (
        <div className={styles.stats}>
          <span className={styles.rating}>
            {rating}
            <StarIcon />
          </span>

          <span>{reviewsCount} отзывов</span>
        </div>
      )}
      <p>Юридическое лицо</p>
    </div>
  );
};
