"use client";

import type { Route } from "next";
import type { CurrentUser } from "@/api/user";
import { HeartIcon, MessageSquareIcon } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { logout } from "@/api/auth";
import { Avatar, Button } from "../ui";
import { AuthDialog } from "./AuthDialog";
import styles from "./Header.module.css";

const GuestActions = () => {
  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const openAuthDialog = () => {
    setIsOpen(true);
  };

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (params.get("auth")) {
      setIsOpen(true);
    }

    router.push(pathname as Route);
  }, []);

  return (
    <div className={styles.actionsWrapper}>
      <Button variant="ghost" onClick={openAuthDialog}>
        Вход / Регистрация
      </Button>

      <Button variant="success" onClick={openAuthDialog}>
        Разместить объявление
      </Button>

      <AuthDialog open={isOpen} onOpenChange={setIsOpen} />
    </div>
  );
};

export const HeaderActions = ({ user }: { user: CurrentUser | null }) => {
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.refresh();
  };

  if (!user) return <GuestActions />;

  return (
    <nav className={styles.actionsWrapper}>
      <Link href="/profile/messages">
        <MessageSquareIcon color="var(--primary)" />
      </Link>

      <Link href="/profile/favorites">
        <HeartIcon color="var(--pink)" />
      </Link>

      <Link href="/profile/products">
        <Avatar src={user.photo} fallback={user.fullName[0]} />
      </Link>

      <Button
        variant="success"
        render={<Link href="/profile/create-product" />}
        nativeButton={false}
      >
        Разместить объявление
      </Button>

      <Button variant="ghost" onClick={handleLogout}>
        Выйти
      </Button>
    </nav>
  );
};
