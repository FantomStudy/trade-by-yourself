"use client";

import { TextSearch } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Typography } from "@/components/ui";
import { Button } from "@/components/ui-lab/Button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui-lab/Dialog";
import { useCategories } from "@/hooks/useCategories";
import styles from "./category-dialog.module.css";

export const CategoryDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const { data } = useCategories();

  const activeCategory = data && data[activeIndex];

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <DialogTrigger asChild>
        <Button>
          <TextSearch /> Все категории
        </Button>
      </DialogTrigger>

      <DialogContent className={styles.dialog}>
        <DialogTitle className={styles.title}>Выбор категории</DialogTitle>

        <div className={styles.content}>
          <div className={styles.list}>
            {data?.map((category, i) => (
              <div
                key={category.id}
                className={styles.categoryItem}
                data-active={activeIndex === i}
                onMouseMove={() => setActiveIndex(i)}
              >
                {category.name}
              </div>
            ))}
          </div>

          <div className={styles.details}>
            <Link
              href={`/${activeCategory?.slug}`}
              className={styles.link}
              onClick={handleClose}
            >
              <Typography variant="h2">{activeCategory?.name}</Typography>
            </Link>

            <div className={styles.subcategoryWrapper}>
              {activeCategory?.subCategories.map((sub) => (
                <div key={sub.id} className={styles.typeWrapper}>
                  <Link
                    href={`/${activeCategory?.slug}/${sub.slug}`}
                    className={styles.link}
                    onClick={handleClose}
                  >
                    <Typography variant="h3">{sub.name}</Typography>
                  </Link>

                  {sub.subcategoryTypes.map((type) => (
                    <Link
                      href={`/${activeCategory?.slug}/${sub.slug}/${type.slug}`}
                      key={type.id}
                      className={styles.link}
                      onClick={handleClose}
                    >
                      {type.name}
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
