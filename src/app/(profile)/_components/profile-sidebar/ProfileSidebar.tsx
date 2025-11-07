import { ProfileInfo } from "./ProfileInfo";
import { ProfileNavigation } from "./ProfileNavigation";

import styles from "./ProfileSidebar.module.css";

export const ProfileSidebar = () => {
  return (
    <aside className={styles.sidebar}>
      <ProfileInfo />
      <ProfileNavigation />
    </aside>
  );
};
