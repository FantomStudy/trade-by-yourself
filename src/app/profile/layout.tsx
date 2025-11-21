import clsx from "clsx";

import { Sidebar } from "./_components/sidebar/sidebar";

import styles from "./layout.module.css";

const ProfileLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className={clsx("global-container", styles.layout)}>
      <Sidebar />
      {children}
    </div>
  );
};

export default ProfileLayout;
