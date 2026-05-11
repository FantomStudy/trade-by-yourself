"use client";

import type { MouseEvent } from "react";

import { X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import styles from "./product-preview.module.css";

interface ProductPreviewProps {
  images: string[];
}

export const ProductPreview = ({ images }: ProductPreviewProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);

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

  const handleImageClick = (e: MouseEvent<HTMLImageElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFullScreen(true);
  };

  const closeFullScreen = () => {
    setIsFullScreen(false);
  };

  return (
    <>
      <div
        className={styles.preview}
        data-slot="product-preview"
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
          style={{ cursor: "pointer" }}
          onClick={handleImageClick}
        />

        {images.length > 1 && (
          <div className={styles.dotsWrapper}>
            {images.map((img, index) => (
              <div key={`dot-${img}`} className={styles.dot} data-active={index === currentIndex} />
            ))}
          </div>
        )}
      </div>

      {/* Полноэкранный просмотр */}
      {isFullScreen && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95"
          onClick={closeFullScreen}
        >
          <button
            className="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
            onClick={closeFullScreen}
          >
            <X className="h-6 w-6" />
          </button>

          <div className="relative h-full w-full p-8">
            <Image
              fill
              alt={images[currentIndex]}
              className="object-contain"
              src={images[currentIndex]}
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          {images.length > 1 && (
            <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 gap-2">
              {images.map((img, index) => (
                <button
                  key={`fullscreen-dot-${img}`}
                  className={`h-3 w-3 rounded-full transition-all ${
                    index === currentIndex ? "bg-white" : "bg-white/50 hover:bg-white/75"
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentIndex(index);
                  }}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
};
