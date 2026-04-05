"use client";

import { useQueryState } from "nuqs";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import styles from "./search-box.module.css";

export const SearchBox = () => {
  const [value, setValue] = useState("");
  const [_, setSearch] = useQueryState("search");

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const search = () => {
    setSearch(value || null);
  };

  return (
    <form className={styles.form} action={search}>
      <Input
        className={styles.input}
        type="search"
        value={value}
        onChange={onChange}
        placeholder="Поиск по объявлениям"
      />
      <Button className={styles.button} type="submit">
        Найти
      </Button>
    </form>
  );
};
