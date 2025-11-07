"use client";

import { createContext } from "react";

import type { GetMeResponse } from "@/lib/api";

interface AuthContextParams {
  user: GetMeResponse | null;
  setUser: (user: GetMeResponse | null) => void;
}

export const AuthContext = createContext<AuthContextParams>({
  user: null,
  setUser: () => {},
});
