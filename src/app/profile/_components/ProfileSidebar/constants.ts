import type { Route } from "next";

interface LinkGroup {
  name: string;
  links: Array<{
    href: Route;
    label: string;
  }>;
}

export const LINK_GROUPS: LinkGroup[] = [
  {
    name: "Основное",
    links: [
      {
        href: "/profile/products",
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
        href: "/profile/settings",
        label: "Настройки",
      },
    ],
  },
  {
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
    name: "Заявки",
    links: [
      {
        href: "/profile/promotions/request",
        label: "Продвижение товара",
      },
      {
        href: "/profile/banners/request",
        label: "Размещение баннера",
      },
      {
        href: "/profile/banners/stats",
        label: "Статистика баннеров",
      },
    ],
  },
];
