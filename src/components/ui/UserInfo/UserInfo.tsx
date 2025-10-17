import { StarIcon } from "@/components/icons";
import styles from "./UserInfo.module.css";
import { Avatar } from "../Avatar/Avatar";

interface UserInfoProps {
  userName?: string;
  rating?: number;
  reviewsCount?: number;
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
