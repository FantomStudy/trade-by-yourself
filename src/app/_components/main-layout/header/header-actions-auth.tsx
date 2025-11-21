import type { CurrentUser } from "@/types";

import { HeartIcon, MessageSquareIcon } from "lucide-react";
import Link from "next/link";

import { Avatar, Button } from "@/components/ui";

import styles from "./header.module.css";

export const HeaderActionsAuth = ({ user }: { user: CurrentUser }) => {
  return (
    <div className={styles.actions}>
      <Link href="/">
        <MessageSquareIcon className="text-secondary" />
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
    </div>
  );
};
