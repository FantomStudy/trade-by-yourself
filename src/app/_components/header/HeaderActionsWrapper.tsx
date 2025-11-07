"use client";

import { useAuth } from "@/lib/contexts";

import { AuthHeaderActions } from "./AuthHeaderActions";
import { GuestHeaderActions } from "./GuestHeaderActions";

export const HeaderActionsWrapper = () => {
  const { user } = useAuth();

  return user ? <AuthHeaderActions /> : <GuestHeaderActions />;
};
