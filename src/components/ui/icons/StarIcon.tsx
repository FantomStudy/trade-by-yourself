import type { LucideProps } from "lucide-react";

import { Star } from "lucide-react";

export const StarIcon = ({
  size = "30px",
  color = "#000",
  ...props
}: LucideProps) => <Star size={size} color={color} {...props} />;
