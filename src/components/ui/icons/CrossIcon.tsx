import type { LucideProps } from "lucide-react";

import { X } from "lucide-react";

export const CrossIcon = ({
  size = "30px",
  color = "#000",
  ...props
}: LucideProps) => <X size={size} color={color} {...props} />;
