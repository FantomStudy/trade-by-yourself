"use client";

import type { ReactNode } from "react";

import { useMemo, useState } from "react";

import type { GetMeResponse } from "@/lib/api";

import { AuthContext } from "./AuthContext";

export interface AuthProviderProps {
  children: ReactNode;
  initialUser: GetMeResponse | null;
}

export const AuthProvider = ({ children, initialUser }: AuthProviderProps) => {
  const [user, setUser] = useState<GetMeResponse | null>(initialUser);

  const value = useMemo(() => ({ user, setUser }), [user]);

  return <AuthContext value={value}>{children}</AuthContext>;
};
