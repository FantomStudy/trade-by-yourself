"use client";

import type { Route } from "next";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button, Input } from "@/components/ui";
import styles from "./Search.module.css";

export const Search = () => {
  const [search, setSearch] = useState("");

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();

    const params = new URLSearchParams(searchParams.toString());

    if (search.trim()) {
      params.set("search", search.trim());
    } else {
      params.delete("search");
    }

    router.push(`${pathname}?${params.toString()}` as Route);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <Input
        type="search"
        className={styles.input}
        name="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Поиск по объявлениям"
      />
      <Button type="submit" className={styles.button}>
        Найти
      </Button>
    </form>
  );
};
