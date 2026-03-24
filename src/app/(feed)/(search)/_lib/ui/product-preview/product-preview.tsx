"use client";

import clsx from "clsx";
import Image from "next/image";
import { useState } from "react";

import styles from "./product-preview.module.css";

export interface ProductPreviewProps extends React.ComponentProps<"div"> {
  images: string[];
}

export const ProductPreview = ({ images, ...props }: ProductPreviewProps) => {
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
      {...props}
      className={clsx(styles.preview, props.className)}
      data-slot="preview"
      onMouseLeave={() => setCurrentIndex(0)}
      onMouseMove={handleMouseMove}
    >
      <div
        style={{
          backgroundImage: `url(${images[currentIndex]})`,
        }}
        className={styles.blur}
      />

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
