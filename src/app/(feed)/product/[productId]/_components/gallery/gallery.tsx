"use client";
import clsx from "clsx";
import { MoveLeft, MoveRight } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { Button } from "@/components/ui";

import styles from "./gallery.module.css";

interface GalleryProps {
  images: string[];
}

export const Gallery = ({ images }: GalleryProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  return (
    <div className={styles.imageGallery}>
      {/* Миниатюры слева */}
      {images.length > 1 && (
        <div className={styles.thumbnails}>
          {images.map((image, index) => (
            <button
              key={image}
              className={`${styles.thumbnail} ${
                index === currentImageIndex ? styles.active : ""
              }`}
              type="button"
              onClick={() => setCurrentImageIndex(index)}
            >
              <Image
                fill
                alt={image}
                src={image}
                style={{ objectFit: "cover" }}
              />
            </button>
          ))}
        </div>
      )}

      {/* Главное изображение справа */}
      <div className={styles.mainImageWrapper}>
        <Image
          fill
          alt={"thumbnail"}
          className={styles.mainImage}
          src={images[currentImageIndex]}
          priority
        />

        {images.length > 1 && (
          <div className={styles.controls}>
            <button
              className={styles.controlItem}
              type="button"
              onClick={prevImage}
            >
              <MoveLeft />
            </button>
            <button
              className={styles.controlItem}
              type="button"
              onClick={nextImage}
            >
              <MoveRight />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
