"use client";

import clsx from "clsx";
import { PlusIcon, Trash2Icon } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useRef } from "react";
import { Button } from "@/components/ui/Button";
import styles from "./ProductImageEditor.module.css";

interface ProductImageEditorProps {
  existingImages?: string[];
  mainImageIndex: number;
  maxImages?: number;
  newImages?: File[];
  onAddImages: (files: File[]) => void;
  onRemoveImage: (index: number) => void;
  onSelectMainImage: (index: number) => void;
}

export const ProductImageEditor = ({
  existingImages = [],
  newImages = [],
  mainImageIndex,
  maxImages = 8,
  onAddImages,
  onRemoveImage,
  onSelectMainImage,
}: ProductImageEditorProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const totalImages = existingImages.length + newImages.length;
  const canAddMoreImages = totalImages < maxImages;

  // Собирает все изображения, даёт им ключ и приводит к единому виду
  const imageItems = useMemo(
    () => [
      // Существующие изображения
      ...existingImages.map((src, index) => ({
        type: "existing" as const,
        key: `existing-${src}-${index}`,
        src,
      })),
      // Новый изображения
      ...newImages.map((file, index) => ({
        type: "new" as const,
        key: `new-${file.name}-${file.lastModified}-${index}`,
        src: URL.createObjectURL(file),
      })),
    ],
    [existingImages, newImages],
  );

  // Удаление лишних URL при размонтировании
  useEffect(() => {
    return () => {
      imageItems.forEach((image) => {
        if (image.type === "new") URL.revokeObjectURL(image.src);
      });
    };
  }, [imageItems]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Преобразование файлов в array
    const files = Array.from(event.target.files || []);
    // Если нет файлов
    if (files.length === 0) return;

    // Сколько ещё изображений можно добавить
    const canAddImages = Math.max(0, maxImages - totalImages);

    onAddImages(files.slice(0, canAddImages));

    // Очищаем поле выбора файлов
    event.target.value = "";
  };

  return (
    <div className={styles.root}>
      <p className={styles.hint}>
        До {maxImages} фото. Нажмите на карточку, чтобы выбрать главное изображение.
      </p>

      <div className={styles.grid}>
        {imageItems.map((image, index) => (
          <div
            key={image.key}
            className={clsx(
              styles.imageCard,
              index === mainImageIndex ? styles.imageCardActive : styles.imageCardIdle,
            )}
            onClick={() => onSelectMainImage(index)}
          >
            <Image
              className={styles.image}
              src={image.src}
              alt={`Фото ${index + 1}`}
              width={320}
              height={320}
              unoptimized={image.type === "new"}
            />
            <span
              className={clsx(
                styles.badge,
                index === mainImageIndex ? styles.badgePrimary : styles.badgeSecondary,
              )}
            >
              {index === mainImageIndex ? "Основное" : image.type === "new" ? "Новое" : "Текущее"}
            </span>
            <Button
              type="button"
              variant="danger"
              size="icon-sm"
              className={clsx(styles.iconButton, styles.badgeTop)}
              aria-label="Удалить фото"
              onClick={(event) => {
                event.stopPropagation();
                onRemoveImage(index);
              }}
            >
              <Trash2Icon />
            </Button>
          </div>
        ))}

        {canAddMoreImages && (
          <Button
            type="button"
            variant="outline"
            className={styles.uploadCard}
            onClick={() => fileInputRef.current?.click()}
          >
            <PlusIcon className={styles.uploadIcon} />
            <span className={styles.uploadText}>Добавить фото</span>
          </Button>
        )}
      </div>

      <input
        ref={fileInputRef}
        className={styles.input}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
      />
    </div>
  );
};
