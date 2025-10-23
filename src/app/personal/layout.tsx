import type { PropsWithChildren } from "react";

import { Sidebar } from "./_components";

import styles from "./layout.module.css";

const ProfileLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className={styles.wrapper}>
      <Sidebar />

      {children}
    </div>
  );
};

export default ProfileLayout;
