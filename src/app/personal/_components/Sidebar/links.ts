interface NavigationGroup {
  id: number;
  group?: string;
  items: Array<{ href: string; label: string }>;
}

export const links: Array<NavigationGroup> = [
  {
    id: 1,
    items: [
      { href: "/profile/listings", label: "Мои обьявления" },
      { href: "/profile/messages", label: "Сообщения" },
      { href: "/profile/favorites", label: "Избранное" },
      { href: "/profile/cart", label: "Корзина" },
      { href: "/profile/settings", label: "Настройки" },
    ],
  },
  {
    id: 2,
    group: "Личный кабинет",
    items: [
      { href: "/profile/analytics", label: "Аналитика" },
      { href: "/profile/promotion", label: "Продвижение" },
      { href: "/profile/support", label: "Тех. поддержка" },
      { href: "/profile/wallet", label: "Пополнение личного кабинета" },
    ],
  },
];
