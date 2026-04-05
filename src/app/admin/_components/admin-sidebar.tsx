"use client";

import {
  FileText,
  FolderTree,
  Megaphone,
  Menu,
  MessageSquare,
  Package,
  Star,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createContext, use, useCallback, useEffect, useState } from "react";

import { Typography } from "@/components/ui";

import styles from "../admin.module.css";

const menuItems = [
  {
    href: "/admin/moderation" as const,
    icon: Package,
    label: "Модерация товаров",
  },
  {
    href: "/admin/reviews" as const,
    icon: Star,
    label: "Модерация отзывов",
  },
  {
    href: "/admin/users" as const,
    icon: Users,
    label: "Пользователи",
  },
  {
    href: "/admin/support" as const,
    icon: MessageSquare,
    label: "Чат поддержки",
  },
  {
    href: "/admin/advertising" as const,
    icon: Megaphone,
    label: "Реклама",
  },
  {
    href: "/admin/categories" as const,
    icon: FolderTree,
    label: "Категории",
  },
  {
    href: "/admin/promotion" as const,
    icon: TrendingUp,
    label: "Продвижение",
  },
  {
    href: "/admin/logs" as const,
    icon: FileText,
    label: "Логи",
  },
];

// Контекст для управления сайдбаром
interface SidebarContextValue {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

const SidebarContext = createContext<SidebarContextValue | null>(null);

export const useSidebar = () => {
  const context = use(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within SidebarProvider");
  }
  return context;
};

export const SidebarProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  // Закрываем сайдбар при переходе на другую страницу
  useEffect(() => {
    close();
  }, [pathname, close]);

  return <SidebarContext value={{ isOpen, open, close, toggle }}>{children}</SidebarContext>;
};

export const AdminSidebar = () => {
  const pathname = usePathname();
  const { isOpen, close } = useSidebar();

  return (
    <>
      {/* Overlay */}
      <div className={`${styles.overlay} ${isOpen ? styles.overlayVisible : ""}`} onClick={close} />

      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ""}`}>
        {/* Кнопка закрытия для мобильных */}
        <button className={styles.closeButton} onClick={close} type="button">
          <X className="h-5 w-5" />
        </button>

        <nav className={styles.nav}>
          <Typography className={styles.navTitle}>Админ панель</Typography>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                href={item.href as any}
                key={item.href}
                className={`${styles.navLink} ${isActive ? styles.navLinkActive : ""}`}
                onClick={close}
              >
                <Icon className={styles.navIcon} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className={styles.sidebarFooter}>
          <Link href={"/" as any} className={styles.backLink} onClick={close}>
            ← Вернуться на сайт
          </Link>
        </div>
      </aside>
    </>
  );
};

// Компонент мобильного header
export const MobileHeader = ({ title }: { title?: string }) => {
  const { toggle } = useSidebar();

  return (
    <div className={styles.mobileHeader}>
      <button className={styles.menuButton} onClick={toggle} type="button">
        <Menu className="h-5 w-5" />
      </button>
      <span className={styles.mobileTitle}>{title || "Админ панель"}</span>
    </div>
  );
};
