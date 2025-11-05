import type { LucideProps } from "lucide-react";

import { Wallet } from "lucide-react";

export const WalletIcon = ({
  size = "30px",
  color = "#000",
  ...props
}: LucideProps) => <Wallet size={size} color={color} {...props} />;
