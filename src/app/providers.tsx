import type { CurrentUser } from "@/types";

import { AuthProvider } from "@/lib/contexts";

interface ProvidersProps {
  children: React.ReactNode;
  user?: CurrentUser;
}

export const Providers = ({ children, user }: ProvidersProps) => {
  return <AuthProvider user={user}>{children}</AuthProvider>;
};
