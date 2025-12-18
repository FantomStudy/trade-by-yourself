import type { AvatarRootProps } from "./primitives";

import { formatFullName } from "@/lib/format";

import { AvatarFallback, AvatarImage, AvatarRoot } from "./primitives";

export interface AvatarProps extends AvatarRootProps {
  fullName: string;
  src?: string;
}

export const Avatar = ({
  size = "md",
  fullName,
  src,
  ...props
}: AvatarProps) => {
  return (
    <AvatarRoot size={size} {...props}>
      {src ? (
        <AvatarImage alt="Picture" src={src} />
      ) : (
        <AvatarFallback>
          {fullName.charAt(0).toUpperCase()}
          <span className="sr-only">{formatFullName(fullName)}</span>
        </AvatarFallback>
      )}
    </AvatarRoot>
  );
};
