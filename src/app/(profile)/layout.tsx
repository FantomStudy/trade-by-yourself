import type { PropsWithChildren } from "react";

import { ProfileSidebar } from "./_components";

import styles from "./layout.module.css";

const ProfileLayout = async ({ children }: PropsWithChildren) => {
  return (
    <main>
      <div className="container">
        <div className={styles.wrapper}>
          <ProfileSidebar />
          {children}
        </div>
      </div>
    </main>
  );
};

export default ProfileLayout;
