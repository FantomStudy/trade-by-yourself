import type { AvatarProps } from "./avatar";

import { formatFullName } from "@/lib/format";

import { AvatarFallback, AvatarImage, AvatarRoot } from "./avatar";

interface UserAvatarProps extends AvatarProps {
  fullName: string;
  src?: string;
}

export function Avatar({
  fullName,
  src,
  size = "md",
  ...props
}: UserAvatarProps) {
  return (
    <AvatarRoot size={size} {...props}>
      {src ? (
        <AvatarImage alt="Picture" src={src} />
      ) : (
        <AvatarFallback size={size}>
          {fullName.charAt(0).toUpperCase()}
          <span className="sr-only">{formatFullName(fullName)}</span>
        </AvatarFallback>
      )}
    </AvatarRoot>
  );
}
