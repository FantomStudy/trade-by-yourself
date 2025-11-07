"use client";

import { UserInfo, WalletIcon } from "@/components/ui";
import { useAuth } from "@/lib/contexts";

import styles from "./ProfileSidebar.module.css";

export const ProfileInfo = () => {
  const { user } = useAuth();

  return (
    <>
      <UserInfo
        fullName={user?.fullName || ""}
        profileType={user?.profileType || ""}
      />

      <span className={styles.wallet}>
        <WalletIcon color="var(--blue)" /> 3000 ₽
      </span>
    </>
  );
};
