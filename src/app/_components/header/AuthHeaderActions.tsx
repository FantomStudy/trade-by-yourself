"use client";

import Link from "next/link";

import { Avatar, Button } from "@/components/ui";
import { useAuth } from "@/lib/contexts";

import styles from "./Header.module.css";

export const AuthHeaderActions = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className={styles.actions}>
      <Link href="/analytics">
        <Avatar className={styles.avatarLink} name={user.fullName} />
      </Link>
      <Link href="/new-product" passHref>
        <Button color="green">Разместить объявление</Button>
      </Link>
    </div>
  );
};
