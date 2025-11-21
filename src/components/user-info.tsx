import type { ComponentProps } from "react";

import type { CurrentUser } from "@/types";

import { formatFullName } from "@/lib/format";

import { Typography } from "./ui";
import { UserAvatar } from "./user-avatar";

interface UserInfoProps extends ComponentProps<"div"> {
  user: CurrentUser;
  photo?: string | null;
  phoneNumber?: string | null;
  isAnswersCall?: boolean | null;
}

export const UserInfo = ({ user, photo, phoneNumber, isAnswersCall }: UserInfoProps) => {
  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <UserAvatar fullName={user.fullName} size="lg" src={photo ?? ""} />
      <Typography variant="h2">{formatFullName(user.fullName)}</Typography>
      {phoneNumber && <div className="text-sm text-muted-foreground">{phoneNumber}</div>}
      {isAnswersCall !== null && (
        <div className="text-sm text-muted-foreground">
          {isAnswersCall ? "Отвечает на звонки" : "Не отвечает на звонки"}
        </div>
      )}
    </div>
  );
};
