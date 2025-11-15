import type { AvatarProps } from "@/components/ui/avatar";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui";
import { formatFullName } from "@/lib/format";

interface UserAvatarProps extends AvatarProps {
  fullName: string;
  src?: string;
}

export function UserAvatar({
  fullName,
  src,
  size = "md",
  ...props
}: UserAvatarProps) {
  return (
    <Avatar size={size} {...props}>
      {src ? (
        <AvatarImage alt="Picture" src={src} />
      ) : (
        <AvatarFallback size={size}>
          {fullName.charAt(0).toUpperCase()}
          <span className="sr-only">{formatFullName(fullName)}</span>
        </AvatarFallback>
      )}
    </Avatar>
  );
}
