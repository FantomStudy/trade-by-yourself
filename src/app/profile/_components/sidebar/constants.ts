import type { Route } from "next";

interface SidebarLinkGroup {
  id: string;
  name?: string;
  links: Array<{
    href: Route;
    label: string;
  }>;
}

export const LINKS: SidebarLinkGroup[] = [
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
