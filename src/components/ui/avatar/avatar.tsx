import type { AvatarRootProps } from "./primitives";

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
        <AvatarImage src={src} />
      ) : (
        <AvatarFallback>
          {fullName.charAt(0).toUpperCase()}
          <span className="sr-only">{fullName}</span>
        </AvatarFallback>
      )}
    </AvatarRoot>
  );
};
