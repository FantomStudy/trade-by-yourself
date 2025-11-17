import type { CurrentUser } from "@/types";

import { createContext } from "react";

interface AuthContextType {
  user: CurrentUser | null;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);
