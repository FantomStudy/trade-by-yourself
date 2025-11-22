"use client";
import { MapPin, TextSearch } from "lucide-react";
import { useEffect, useState } from "react";

import { Button, Input } from "@/components/ui";
import { api } from "@/lib/api/instance";

import styles from "./search.module.css";

export const Search = ({
  setProducts,
}: {
  setProducts: (products: any[]) => void;
}) => {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const debounceTimeout = 400;

  // Загрузка всех товаров при первом рендере
  useEffect(() => {
    (async () => {
      const allProducts = await api("/product/all-products");
      setProducts(allProducts);
      setLoading(false);
    })();
  }, [setProducts]);

  // Автоматический запрос при изменении search с debounce
  useEffect(() => {
    const handler = setTimeout(async () => {
      setLoading(true);
      const filtered = await api("/product/all-products", {
        query: { search },
      });
      setProducts(filtered);
      setLoading(false);
    }, debounceTimeout);
    return () => clearTimeout(handler);
  }, [search, setProducts]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Не нужен, поиск происходит автоматически
  };

  return (
    <div className={styles.search}>
      <div className="global-container">
        <div className={styles.wrapper}>
          <Button>
            <TextSearch className={styles.icon} /> Все категории
          </Button>

          <form className={styles.form} onSubmit={handleSubmit}>
            <Input
              className={styles.input}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Поиск по объявлениям"
            />
            <Button className={styles.button} disabled={loading} type="submit">
              {loading ? "Поиск..." : "Найти"}
            </Button>
          </form>

          <Button variant="ghost">
            <MapPin className={styles.icon} /> Во всех регионах
          </Button>
        </div>
      </div>
    </div>
  );
};
