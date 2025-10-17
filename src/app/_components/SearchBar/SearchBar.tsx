import { Button, Input } from "@/components/ui";
import styles from "./SearchBar.module.css";

export const SearchBar = () => {
  return (
    <div className={styles.searchBar}>
      <div className="container">
        <form className={styles.form}>
          <select className={styles.category}>
            <option value="">Категории</option>
          </select>

          <div className={styles.inputGroup}>
            <select className={styles.city}>
              <option value="">г. Оренбург</option>
            </select>
            <Input
              placeholder="Поиск по объявлениям"
              className={styles.input}
            />
            <Button className={styles.button}>Найти</Button>
          </div>
        </form>
      </div>
    </div>
  );
};
