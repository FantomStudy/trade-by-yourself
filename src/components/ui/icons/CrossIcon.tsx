import type { IconProps } from "./types";

export const CrossIcon = ({ size = 25 }: IconProps) => {
  return (
    <svg
      fill="none"
      height={size}
      width={size}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
    >
      <path
        d="M6.16943 6.34521L17.4831 17.6589"
        stroke="black"
        strokeLinecap="round"
        strokeWidth="2"
      />
      <path
        d="M6.17383 17.6592L17.4875 6.34547"
        stroke="black"
        strokeLinecap="round"
        strokeWidth="2"
      />
    </svg>
  );
};
