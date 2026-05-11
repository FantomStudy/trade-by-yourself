"use client";

import Image from "next/image";
import { useState } from "react";
import styles from "./ProductCardPreview.module.css";

interface ProductCardPreviewProps {
  images: string[];
}

// TODO: Add swipe support and make images loop when swiping on mobile
export const ProductCardPreview = ({ images }: ProductCardPreviewProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!(images.length > 1)) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const sectionWidth = rect.width / images.length;
    const index = Math.floor(x / sectionWidth);

    setCurrentIndex(Math.min(index, images.length - 1));
  };

  return (
    <div
      className={styles.preview}
      onMouseLeave={() => setCurrentIndex(0)}
      onMouseMove={handleMouseMove}
      style={{ backgroundImage: `url(${images[currentIndex]})` }}
    >
      <Image
        key={currentIndex}
        alt={images[currentIndex]}
        className={styles.image}
        height={500}
        src={images[currentIndex]}
        width={500}
      />

      {images.length > 1 && (
        <div className={styles.dotsWrapper}>
          {images.map((img, index) => (
            <div key={`dot-${img}`} className={styles.dot} data-active={index === currentIndex} />
          ))}
        </div>
      )}
    </div>
  );
};
