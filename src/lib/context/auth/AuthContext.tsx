import { CurrentUser } from "@/types";
import { createContext } from "react";

interface AuthContextType {
  user?: CurrentUser;
}

export const AuthContext = createContext<AuthContextType>({});

export interface AuthProviderProps {
  children: React.ReactNode;
  user?: CurrentUser;
}

export const AuthProvider = ({ children, user }: AuthProviderProps) => {
  return <AuthContext value={{ user }}>{children}</AuthContext>;
};
