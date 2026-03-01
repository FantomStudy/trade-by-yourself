"use client";

import type { CurrentUser } from "@/types";

import {
  HeartIcon,
  HomeIcon,
  LogOutIcon,
  MenuIcon,
  MessageSquareIcon,
  PlusCircleIcon,
  UserIcon,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { AuthDialog } from "@/components/auth-dialog";
import { Avatar, Sheet } from "@/components/ui";
import { Button } from "@/components/ui-lab/Button";
import { useAuth } from "@/lib/contexts";
import styles from "./mobile-menu.module.css";

interface AuthenticatedMenuProps {
  user: CurrentUser;
  onClose: () => void;
  onLogout: () => void;
}

const AuthenticatedMenu = ({
  user,
  onClose,
  onLogout,
}: AuthenticatedMenuProps) => {
  const handleLogout = () => {
    onLogout();
    onClose();
  };

  return (
    <>
      <div className={styles.userSection}>
        <Avatar fullName={user.fullName} size="lg" />
        <span className={styles.userName}>{user.fullName}</span>
      </div>

      <div className={styles.menuItems}>
        <Link href="/" className={styles.menuItem} onClick={onClose}>
          <HomeIcon size={20} />
          <span>Главная</span>
        </Link>

        <Link
          href="/profile/my-products"
          className={styles.menuItem}
          onClick={onClose}
        >
          <UserIcon size={20} />
          <span>Мои объявления</span>
        </Link>

        <Link
          href="/profile/messages"
          className={styles.menuItem}
          onClick={onClose}
        >
          <MessageSquareIcon size={20} />
          <span>Сообщения</span>
        </Link>

        <Link
          href="/profile/favorites"
          className={styles.menuItem}
          onClick={onClose}
        >
          <HeartIcon size={20} />
          <span>Избранное</span>
        </Link>

        <Link
          href="/profile/create-product"
          className={styles.menuItemHighlight}
          onClick={onClose}
        >
          <PlusCircleIcon size={20} />
          <span>Разместить объявление</span>
        </Link>
      </div>

      <div className={styles.footer}>
        <button
          className={styles.logoutButton}
          type="button"
          onClick={handleLogout}
        >
          <LogOutIcon size={20} />
          <span>Выйти</span>
        </button>
      </div>
    </>
  );
};

interface GuestMenuProps {
  onAuthClick: () => void;
  onClose: () => void;
}

const GuestMenu = ({ onAuthClick, onClose }: GuestMenuProps) => {
  return (
    <>
      <div className={styles.menuItems}>
        <Link href="/" className={styles.menuItem} onClick={onClose}>
          <HomeIcon size={20} />
          <span>Главная</span>
        </Link>
      </div>

      <div className={styles.guestActions}>
        <Button className={styles.authButton} onClick={onAuthClick}>
          Вход / Регистрация
        </Button>
        <Button
          className={styles.authButton}
          variant="success"
          onClick={onAuthClick}
        >
          Разместить объявление
        </Button>
      </div>
    </>
  );
};

export const MobileMenu = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const handleClose = () => setIsOpen(false);

  const handleAuthClick = () => {
    handleClose();
    setIsAuthOpen(true);
  };

  return (
    <>
      <Button
        aria-label="Открыть меню"
        className={styles.burgerButton}
        size="icon"
        variant="ghost"
        onClick={() => setIsOpen(true)}
      >
        <MenuIcon size={24} />
      </Button>

      <Sheet onOpenChange={setIsOpen} open={isOpen}>
        <Sheet.Content className={styles.content} side="right">
          <Sheet.Header className={styles.header}>
            <Sheet.Title className={styles.title}>Меню</Sheet.Title>
          </Sheet.Header>

          <nav className={styles.nav}>
            {user ? (
              <AuthenticatedMenu
                user={user}
                onClose={handleClose}
                onLogout={logout}
              />
            ) : (
              <GuestMenu onAuthClick={handleAuthClick} onClose={handleClose} />
            )}
          </nav>
        </Sheet.Content>
      </Sheet>

      <AuthDialog onOpenChange={setIsAuthOpen} open={isAuthOpen} />
    </>
  );
};
