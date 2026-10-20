"use client";

import {
  BarChart3,
  FileText,
  FolderTree,
  Handshake,
  Megaphone,
  Menu,
  MessageSquare,
  Package,
  Shield,
  Star,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createContext, use, useCallback, useEffect, useState } from "react";

import { useQuery } from "@tanstack/react-query";
import { getAdminDeals } from "@/api/requests";
import { getAllSupportTickets } from "@/lib/api/requests";
import { useProductsToModerate } from "@/api/hooks";
import { api } from "@/lib/api/instance";
import { Typography } from "@/components/ui";

import styles from "../admin.module.css";

const menuItems = [
  { href: "/admin/analytics" as const, icon: BarChart3, label: "Аналитика" },
  { href: "/admin/moderation" as const, icon: Package, label: "Модерация товаров" },
  { href: "/admin/reviews" as const, icon: Star, label: "Модерация отзывов" },
  { href: "/admin/users" as const, icon: Users, label: "Пользователи" },
  { href: "/admin/roles" as const, icon: Shield, label: "Роли и права" },
  { href: "/admin/deals" as const, icon: Handshake, label: "Сделки" },
  { href: "/admin/support" as const, icon: MessageSquare, label: "Чат поддержки" },
  { href: "/admin/advertising" as const, icon: Megaphone, label: "Реклама" },
  { href: "/admin/categories" as const, icon: FolderTree, label: "Категории" },
  { href: "/admin/promotion" as const, icon: TrendingUp, label: "Продвижение" },
  { href: "/admin/logs" as const, icon: FileText, label: "Логи" },
];

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

  useEffect(() => {
    close();
  }, [pathname, close]);

  return <SidebarContext value={{ isOpen, open, close, toggle }}>{children}</SidebarContext>;
};

export const AdminSidebar = () => {
  const pathname = usePathname();
  const { isOpen, close } = useSidebar();

  const { data: supportTicketsData } = useQuery({
    queryKey: ["admin-sidebar-support"],
    queryFn: getAllSupportTickets,
    refetchInterval: 10000,
  });

  const { data: dealsData } = useQuery({
    queryKey: ["admin-sidebar-deals"],
    queryFn: getAdminDeals,
    refetchInterval: 15000,
  });

  const { data: productsData } = useProductsToModerate("MANUAL", 1);

  const { data: bannersData } = useQuery({
    queryKey: ["admin-sidebar-banners"],
    queryFn: () => api<any[]>("/banner/all-banners-to-moderate"),
    refetchInterval: 20000,
  });

  const supportCount = (supportTicketsData?.tickets ?? []).filter(
    (t) => t.status === "OPEN" || t.status === "IN_PROGRESS",
  ).length;

  const dealsCount = (dealsData ?? []).filter(
    (d) => d.status === "CREATED" || d.status === "DISPUTE",
  ).length;

  const moderationCount = productsData?.total ?? 0;
  const bannerCount = bannersData?.length ?? 0;

  return (
    <>
      <div className={`${styles.overlay} ${isOpen ? styles.overlayVisible : ""}`} onClick={close} />

      <aside className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ""}`}>
        <button className={styles.closeButton} onClick={close} type="button">
          <X className="h-5 w-5" />
        </button>

        <nav className={styles.nav}>
          <Typography className={styles.navTitle}>Админ панель</Typography>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            let badge = 0;
            if (item.href === "/admin/support") badge = supportCount;
            else if (item.href === "/admin/deals") badge = dealsCount;
            else if (item.href === "/admin/moderation") badge = moderationCount;
            else if (item.href === "/admin/advertising") badge = bannerCount;

            return (
              <Link
                href={item.href as any}
                key={item.href}
                className={`${styles.navLink} ${isActive ? styles.navLinkActive : ""}`}
                onClick={close}
              >
                <Icon className={styles.navIcon} />
                <span>{item.label}</span>
                {badge > 0 ? (
                  <span className={styles.navBadge}>{badge > 99 ? "99+" : badge}</span>
                ) : null}
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
