import type { CurrentUser } from "@/types";

import { HeartIcon, MessageSquareIcon } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

import { useChats } from "@/api/hooks";
import { Avatar, Button } from "@/components/ui";
import { useAuth } from "@/lib/contexts";

import styles from "./header.module.css";

export const HeaderActionsAuth = ({ user }: { user: CurrentUser }) => {
  const { logout } = useAuth();
  const { data: chats = [] } = useChats();

  const unreadChatsCount = useMemo(() => {
    return chats.reduce((total, chat) => total + (chat.unreadCount ?? 0), 0);
  }, [chats]);

  return (
    <div className={styles.actions}>
      <Link className={styles.chatLink} href="/profile/messages">
        <MessageSquareIcon className="text-secondary" />
        {unreadChatsCount > 0 ? (
          <span className={styles.chatBadge}>{unreadChatsCount > 99 ? "99+" : unreadChatsCount}</span>
        ) : null}
      </Link>

      <Link href="/profile/favorites">
        <HeartIcon className="text-pink" />
      </Link>

      <Link href="/profile/my-products">
        <Avatar fullName={user.fullName} />
      </Link>

      <Button asChild variant="secondary">
        <Link href="/profile/create-product">Разместить объявление</Link>
      </Button>

      <Button variant="ghost" onClick={logout}>
        Выйти
      </Button>
    </div>
  );
};
