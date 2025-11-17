import type { CurrentUser } from "@/types";

import Link from "next/link";

import { UserAvatar } from "@/components";
import { Button, HeartIcon, MessageSquareIcon } from "@/components/ui";

export const HeaderActionsAuth = ({ user }: { user: CurrentUser }) => {
  return (
    <div className="flex items-center gap-8">
      <Link href="/">
        <MessageSquareIcon className="text-secondary" />
      </Link>

      <Link href="/profile/favorites">
        <HeartIcon className="text-pink" />
      </Link>

      <Link href="/profile/my-products" className="flex items-center gap-2">
        <UserAvatar fullName={user.fullName} />
      </Link>

      <Button asChild variant="secondary">
        <Link href="/profile/create-product">Разместить объявление</Link>
      </Button>
    </div>
  );
};
