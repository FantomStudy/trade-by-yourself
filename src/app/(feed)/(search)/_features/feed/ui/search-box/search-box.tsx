"use client";

import { useQueryState } from "nuqs";
import { useState } from "react";

import { Button } from "@/app/(feed)/(search)/_lib/ui/button";
import { Input } from "@/app/(feed)/(search)/_lib/ui/input";

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
