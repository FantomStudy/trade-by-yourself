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
        href: "/profile/settings",
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
        href: "/profile/balance",
        label: "Пополнение баланса",
      },
    ],
  },
  {
    id: "requests",
    name: "Заявки",
    links: [
      {
        href: "/profile/promotion-request",
        label: "Продвижение товара",
      },
      {
        href: "/profile/banner-request",
        label: "Размещение баннера",
      },
      {
        href: "/profile/banner-stats",
        label: "Статистика баннеров",
      },
    ],
  },
];
