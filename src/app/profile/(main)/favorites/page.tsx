import { Typography } from "@/components/ui";
import { verifySession } from "@/lib/dal";
import { Favorites } from "./_components/Favorites";
import styles from "./page.module.css";

const FavoritesPage = async () => {
  const { user } = await verifySession();

  if (!user) {
    return <Typography>Войдите в профиль, чтобы посмотреть сохранённые объявления</Typography>;
  }

  return (
    <div className={styles.page}>
      <Typography variant="h2">Избранное</Typography>
      <Favorites />
    </div>
  );
};

export default FavoritesPage;
