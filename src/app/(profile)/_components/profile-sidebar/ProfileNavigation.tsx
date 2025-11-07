import Link from "next/link";

import styles from "./ProfileSidebar.module.css";

export const ProfileNavigation = () => {
  return (
    <nav className={styles.navigation}>
      <div className={styles.navGroup}>
        <Link href="/listings">Мои обьявления</Link>
        <Link href="/" style={{ opacity: 0.5 }}>
          Сообщения
        </Link>
        <Link href="/" style={{ opacity: 0.5 }}>
          Избранное
        </Link>
        <Link href="/" style={{ opacity: 0.5 }}>
          Корзина
        </Link>
        <Link href="/" style={{ opacity: 0.5 }}>
          Настройки
        </Link>
      </div>

      <div className={styles.navGroup}>
        <h2 className={styles.navTitle}>Личный кабинет</h2>

        <Link href="/analytics">Аналитика</Link>
        <Link href="/" style={{ opacity: 0.5 }}>
          Продвижение
        </Link>
        <Link href="/" style={{ opacity: 0.5 }}>
          Тех. поддержка
        </Link>
        <Link href="/" style={{ opacity: 0.5 }}>
          Пополнение личного кабинета
        </Link>
      </div>
    </nav>
  );
};
