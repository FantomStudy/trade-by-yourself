import clsx from "clsx";
import {
  HeartIcon,
  LayoutGridIcon,
  MessageCircleIcon,
  PlusIcon,
  UserRoundIcon,
} from "lucide-react";
import { getCurrentUser } from "@/api/requests";
import { Avatar } from "@/components/ui/Avatar";
import { ActiveLink } from "./ActiveLink";
import styles from "./MobileTabs.module.css";

export const MobileTabs = async () => {
  const user = await getCurrentUser().catch(() => undefined);

  return (
    <nav className={clsx(styles.nav, "mobile-only")}>
      <ActiveLink href="/">
        <LayoutGridIcon fill="currentColor" />
        <span>Поиск</span>
      </ActiveLink>

      <ActiveLink href="/profile/favorites">
        <HeartIcon fill="currentColor" />
        <span>Избранное</span>
      </ActiveLink>

      <ActiveLink href="/profile/my-products">
        <PlusIcon />
        <span>Объявления</span>
      </ActiveLink>

      <ActiveLink href="/profile/messages">
        <MessageCircleIcon fill="currentColor" />
        <span>Сообщения</span>
      </ActiveLink>

      <ActiveLink href="/profile/settings">
        {user?.photo ? (
          <Avatar
            size="sm"
            src={user.photo}
            fallback={user.fullName}
            className={styles.avatar}
          />
        ) : (
          <UserRoundIcon fill="currentColor" />
        )}
        <span>Профиль</span>
      </ActiveLink>
    </nav>
  );
};
