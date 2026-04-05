import type { CurrentUser } from "@/types";
import { HeartIcon, MessageSquareIcon } from "lucide-react";
import Link from "next/link";
import { Avatar } from "@/components/ui";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/lib/contexts";
import styles from "./header.module.css";

export const HeaderActionsAuth = ({ user }: { user: CurrentUser }) => {
  const { logout } = useAuth();
  return (
    <div className={styles.actions}>
      <Link href="/profile/messages">
        <MessageSquareIcon className="text-secondary" />
      </Link>

      <Link href="/profile/favorites">
        <HeartIcon className="text-pink" />
      </Link>

      <Link href="/profile/my-products">
        <Avatar fullName={user.fullName} />
      </Link>

      <Button
        variant="success"
        nativeButton={false}
        render={<Link href="/profile/create-product" />}
      >
        Разместить объявление
      </Button>

      <Button variant="ghost" onClick={logout}>
        Выйти
      </Button>
    </div>
  );
};
