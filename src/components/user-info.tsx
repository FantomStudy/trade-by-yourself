import type { ComponentProps } from "react";

import type { CurrentUser } from "@/types";

import { formatFullName } from "@/lib/format";

import { Typography } from "./ui";
import { UserAvatar } from "./user-avatar";

interface UserInfoProps extends ComponentProps<"div"> {
  user: CurrentUser;
}

export const UserInfo = ({ user }: UserInfoProps) => {
  return (
    <div className="flex flex-col items-center gap-4">
      <UserAvatar fullName={user.fullName} size="lg" src="" />
      <Typography variant="h2">{formatFullName(user.fullName)}</Typography>

      {/* {Boolean(rating && reviewsCount) && (
        <div className={styles.stats}>
          <span className={styles.rating}>
            {rating}
            <StarIcon />
          </span>

          <span>{reviewsCount} отзывов</span>
        </div>
      )} */}
    </div>
  );
};
