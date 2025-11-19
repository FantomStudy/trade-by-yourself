"use client";

import type { Route } from "next";

import { WalletIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

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
  const pathname = usePathname();

  const getProfileTypeLabel = (type: string) => {
    return type === "OOO" ? "Юридическое лицо" : "Физическое лицо";
  };

  const isLegalEntity = user?.profileType === "OOO";

  return (
    <div className="bg-background flex flex-col items-center gap-5 rounded-md px-6 py-8">
      {user && (
        <>
          <UserInfo user={user} />

          {/* Бейдж типа профиля */}
          <div
            className={`flex items-center gap-2 rounded-full px-3 py-1 ${
              isLegalEntity ? "bg-green-50" : "bg-blue-50"
            }`}
          >
            <div
              className={`h-2 w-2 rounded-full ${
                isLegalEntity ? "bg-green-500" : "bg-blue-500"
              }`}
            ></div>
            <span
              className={`text-sm font-medium ${
                isLegalEntity ? "text-green-700" : "text-blue-700"
              }`}
            >
              {getProfileTypeLabel(user.profileType)}
            </span>
          </div>

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
              {group.links.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    href={link.href}
                    key={link.label}
                    className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </div>
  );
};
