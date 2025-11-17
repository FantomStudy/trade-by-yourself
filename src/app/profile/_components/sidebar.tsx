"use client";

import type { Route } from "next";

import { WalletIcon } from "lucide-react";
import Link from "next/link";

import { UserInfo } from "@/components";
import { Typography } from "@/components/ui";
import { useAuth } from "@/lib/contexts";

interface SidebarLinkGroup {
  id: string;
  name?: string;
  links: Array<{
    href: Route;
    label: string;
  }>;
}

const LINKS: SidebarLinkGroup[] = [
  {
    id: "main",
    name: "Основное",
    links: [
      {
        href: "/profile/my-products",
        label: "Мои обьявления",
      },
      {
        href: "/profile/messages",
        label: "Сообщения",
      },
      {
        href: "/profile/favorites",
        label: "Избранное",
      },
      {
        // href: "/profile/settings",
        href: "/profile/my-products",
        label: "Настройки",
      },
    ],
  },
  {
    id: "profile",
    name: "Личный кабинет",
    links: [
      {
        href: "/profile/analytics",
        label: "Аналитика",
      },
      {
        href: "/profile/my-products",
        // href: "/profile/support",
        label: "Тех. поддержка",
      },
      {
        // href: "/profile/wallet",
        href: "/profile/my-products",
        label: "Пополнение личного кабинета",
      },
    ],
  },
];

export const Sidebar = () => {
  const { user } = useAuth();

  return (
    <div className="bg-background flex flex-col items-center gap-5 rounded-md px-6 py-8">
      {user && (
        <>
          <UserInfo user={user} />
          <span className="text-primary flex items-center gap-1">
            <WalletIcon color="var(--primary)" /> ₽
          </span>
        </>
      )}

      <nav className="flex w-full flex-col gap-10">
        {LINKS.map((group) => (
          <div key={group.id} className="flex flex-col gap-6">
            {group.name && <Typography variant="h2">{group.name}</Typography>}

            <div className="flex flex-col gap-4">
              {group.links.map((link) => (
                <Link href={link.href} key={link.label}>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </nav>
    </div>
  );
};
