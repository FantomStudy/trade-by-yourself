import type { PropsWithChildren } from "react";

import { ProfileSidebar } from "@/components/layout";

import styles from "./layout.module.css";

const ProfileLayout = async ({ children }: PropsWithChildren) => {
  return (
    <div className={styles.wrapper}>
      <ProfileSidebar />
      {children}
    </div>
  );
};

export default ProfileLayout;
