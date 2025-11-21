import { MapPin, TextSearch } from "lucide-react";

import { Button, Input } from "@/components/ui";

import styles from "./search.module.css";

export const Search = () => {
  return (
    <div className={styles.search}>
      <div className="global-container">
        <div className={styles.wrapper}>
          <Button>
            <TextSearch className={styles.icon} /> Все категории
          </Button>

          <form className={styles.form}>
            <Input
              className={styles.input}
              placeholder="Поиск по объявлениям"
            />
            <Button className={styles.button}>Найти</Button>
          </form>

          <Button variant="ghost">
            <MapPin className={styles.icon} /> Во всех регионах
          </Button>
        </div>
      </div>
    </div>
  );
};
