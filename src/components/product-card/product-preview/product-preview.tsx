"use client";

import type { MouseEvent } from "react";

import Image from "next/image";
import { useState } from "react";

import styles from "./product-preview.module.css";

interface ProductPreviewProps {
  images: string[];
}

export const ProductPreview = ({ images }: ProductPreviewProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!(images.length > 1)) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const sectionWidth = rect.width / images.length;
    const index = Math.floor(x / sectionWidth);

    setCurrentIndex(Math.min(index, images.length - 1));
  };

  const handleMouseLeave = () => {
    setCurrentIndex(0);
  };

  return (
    <div
      className={styles.preview}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      <div
        style={{
          backgroundImage: `url(${images[currentIndex]})`,
        }}
        className={styles.previewBlur}
      />

      <Image
        fill
        key={currentIndex}
        alt={images[currentIndex]}
        className={styles.previewImage}
        src={images[currentIndex]}
      />

      {images.length > 1 && (
        <div className={styles.dotsWrapper}>
          {images.map((img, index) => (
            <div
              key={`dot-${img}`}
              className={styles.dot}
              data-active={index === currentIndex}
            />
          ))}
        </div>
      )}
    </div>
  );
};
