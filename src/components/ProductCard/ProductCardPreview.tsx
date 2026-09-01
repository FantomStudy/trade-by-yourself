"use client";

import Image from "next/image";
import { useState } from "react";
import styles from "./ProductCardPreview.module.css";

interface ProductCardPreviewProps {
  images?: string[] | null;
}

// TODO: Add swipe support and make images loop when swiping on mobile
export const ProductCardPreview = ({ images = [] }: ProductCardPreviewProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const safeImages = Array.isArray(images) && images.length > 0 ? images.filter(Boolean) : [];
  const hasImages = safeImages.length > 0;
  const currentSrc = hasImages ? (safeImages[currentIndex] || safeImages[0]) : "/placeholder.png";

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (safeImages.length <= 1) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const sectionWidth = rect.width / safeImages.length;
    const index = Math.floor(x / sectionWidth);

    setCurrentIndex(Math.min(index, safeImages.length - 1));
  };

  return (
    <div
      className={styles.preview}
      onMouseLeave={() => setCurrentIndex(0)}
      onMouseMove={handleMouseMove}
      style={{ backgroundImage: `url(${currentSrc})` }}
    >
      <Image
        key={currentIndex}
        alt={currentSrc || "Товар"}
        className={styles.image}
        height={500}
        src={currentSrc}
        width={500}
      />

      {safeImages.length > 1 && (
        <div className={styles.dotsWrapper}>
          {safeImages.map((img, index) => (
            <div key={`dot-${img}`} className={styles.dot} data-active={index === currentIndex} />
          ))}
        </div>
      )}
    </div>
  );
};
