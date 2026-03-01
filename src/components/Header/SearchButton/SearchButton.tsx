"use client";

import { Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui-lab/Button";
import styles from "./SearchButton.module.css";

export const SearchButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      router.push(`/?search=${encodeURIComponent(searchValue.trim())}`);
      setIsOpen(false);
      setSearchValue("");
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setSearchValue("");
  };

  return (
    <div className={styles.container}>
      {!isOpen ? (
        <Button
          aria-label="Открыть поиск"
          className={styles.searchButton}
          size="icon"
          variant="ghost"
          onClick={() => setIsOpen(true)}
        >
          <Search />
        </Button>
      ) : (
        <form className={styles.searchForm} onSubmit={handleSubmit}>
          <div className={styles.inputWrapper}>
            <Search className={styles.searchIcon} />
            <input
              ref={inputRef}
              className={styles.input}
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Поиск объявлений..."
            />
            <Button
              aria-label="Закрыть поиск"
              className={styles.closeButton}
              size="icon"
              type="button"
              variant="ghost"
              onClick={handleClose}
            >
              <X />
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};
