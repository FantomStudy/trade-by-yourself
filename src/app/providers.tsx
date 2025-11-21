import { AuthProvider } from "@/lib/context";
import { CurrentUser } from "@/types";

interface ProvidersProps {
  children: React.ReactNode;
  user?: CurrentUser;
}

export const Providers = ({ children, user }: ProvidersProps) => {
  return <AuthProvider user={user}>{children}</AuthProvider>;
};
