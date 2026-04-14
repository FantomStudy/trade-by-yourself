import { getCurrentUser } from "@/api/auth";
import { BannerSlot } from "@/components/BannerSlot";
import { ProfileSidebar } from "./_components/ProfileSidebar";
import styles from "./layout.module.css";

const ProfileLayout = async ({ children }: LayoutProps<"/profile">) => {
  const user = await getCurrentUser();

  return (
    <div className="container">
      <div className={styles.layout}>
        <aside className={styles.aside}>
          <ProfileSidebar user={user} />
          <BannerSlot place="CHATS" />
        </aside>

        {children}
      </div>
    </div>
  );
};

export default ProfileLayout;
