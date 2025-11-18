"use client";

import { Megaphone, MessageSquare, Package } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Typography } from "@/components/ui";

const menuItems = [
  {
    href: "/admin/moderation" as const,
    icon: Package,
    label: "Модерация товаров",
  },
  {
    href: "/admin/support" as const,
    icon: MessageSquare,
    label: "Чат поддержки",
  },
  {
    href: "/admin/advertising" as const,
    icon: Megaphone,
    label: "Управление рекламой",
  },
];

export const AdminSidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="flex w-64 flex-col border-r bg-white">
      <nav className="flex-1 space-y-2 p-4">
        <Typography className="mb-4 px-3 text-xs font-semibold text-gray-500 uppercase">
          Админ панель
        </Typography>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              href={item.href as any}
              key={item.href}
              className={`flex items-center gap-4 rounded-lg px-4 py-3 text-base font-medium transition-colors ${
                isActive
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Icon className="h-6 w-6" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t p-4">
        <Link
          href={"/" as any}
          className="flex items-center gap-4 rounded-lg px-4 py-3 text-base font-medium text-gray-700 transition-colors hover:bg-gray-100"
        >
          <Typography>← Вернуться на сайт</Typography>
        </Link>
      </div>
    </aside>
  );
};
