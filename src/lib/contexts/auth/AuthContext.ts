import type { CurrentUser } from "@/types";

import { createContext } from "react";

interface AuthContextType {
  user: CurrentUser | null;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);
