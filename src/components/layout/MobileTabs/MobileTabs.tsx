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
        <LayoutGridIcon fill="currentColor" /> Поиск
      </ActiveLink>

      <ActiveLink href="/profile/favorites">
        <HeartIcon fill="currentColor" /> Избранное
      </ActiveLink>

      <ActiveLink href="/profile/my-products">
        <PlusIcon /> Объявления
      </ActiveLink>

      <ActiveLink href="/profile/messages">
        <MessageCircleIcon fill="currentColor" /> Сообщения
      </ActiveLink>

      <ActiveLink href="/profile/settings">
        {user ? (
          <Avatar size="sm" src={user.photo} fallback={user.fullName} className={styles.avatar} />
        ) : (
          <UserRoundIcon fill="currentColor" />
        )}
        Профиль
      </ActiveLink>
    </nav>
  );
};
