import { createContext } from "react";

import type { CurrentUser } from "@/types";

interface AuthContextType {
  user: CurrentUser | null;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);
