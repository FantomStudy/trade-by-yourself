import Link from "next/link";

import { WalletIcon } from "@/components/ui";
import { getMe } from "@/lib/api";

import { UserInfo } from "../user-info/UserInfo";

import styles from "./ProfileSidebar.module.css";

export const ProfileSidebar = async () => {
  let profile;

  try {
    profile = await getMe();
  } catch (error) {
    console.log(error);

    return null;
  }

  return (
    <aside className={styles.sidebar}>
      <UserInfo fullName={profile.fullName} profileType={profile.profileType} />

      <span className={styles.wallet}>
        <WalletIcon color="var(--blue)" /> 3000 ₽
      </span>

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
    </aside>
  );
};
