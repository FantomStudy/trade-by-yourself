import Link from "next/link";

import styles from "./ProfileSidebar.module.css";

export const ProfileNavigation = () => {
  return (
    <nav className={styles.navigation}>
      <div className={styles.navGroup}>
        <Link href="/">Мои обьявления</Link>
        <Link href="/">Сообщения</Link>
        <Link href="/">Избранное</Link>
        <Link href="/">Корзина</Link>
        <Link href="/">Настройки</Link>
      </div>

      <div className={styles.navGroup}>
        <h2 className={styles.navTitle}>Личный кабинет</h2>

        <Link href="/">Аналитика</Link>
        <Link href="/">Продвижение</Link>
        <Link href="/">Тех. поддержка</Link>
        <Link href="/">Пополнение личного кабинета</Link>
      </div>
    </nav>
  );
};
