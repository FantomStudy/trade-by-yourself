"use client";

import type { ReactNode } from "react";

import type { AuthProviderProps } from "@/lib/contexts";

import { AuthProvider } from "@/lib/contexts";

interface ProvidersProps {
  children: ReactNode;
  user: Omit<AuthProviderProps, "children">;
}

export const Providers = ({ children, user }: ProvidersProps) => {
  return <AuthProvider {...user}>{children}</AuthProvider>;
};
