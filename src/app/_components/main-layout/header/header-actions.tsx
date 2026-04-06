"use client";

import { useAuth } from "@/lib/contexts";

import { HeaderActionsAuth } from "./header-actions-auth";
import { HeaderActionsGuest } from "./header-actions-guest";

export const HeaderActions = () => {
  const { user } = useAuth();

  return user ? <HeaderActionsAuth user={user} /> : <HeaderActionsGuest />;
};
