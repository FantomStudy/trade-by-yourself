"use client";

import { useQuery } from "@tanstack/react-query";
import { TextSearch } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Button } from "@/app/(feed)/(search)/_lib/ui/button";
import { Dialog } from "@/app/(feed)/(search)/_lib/ui/dialog";
import { Typography } from "@/app/(feed)/(search)/_lib/ui/typography";

import { getCategories } from "../../../category";

import styles from "./category-dialog.module.css";

export const CategoryDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const { data } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const activeCategory = data && data[activeIndex];

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <Dialog.Trigger asChild>
        <Button>
          <TextSearch /> Все категории
        </Button>
      </Dialog.Trigger>

      <Dialog.Content className={styles.dialog}>
        <Dialog.Title className={styles.title}>Выбор категории</Dialog.Title>

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
            <Link href={`/${activeCategory?.slug}`} className={styles.link} onClick={handleClose}>
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
      </Dialog.Content>
    </Dialog>
  );
};
