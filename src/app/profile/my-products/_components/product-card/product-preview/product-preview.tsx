"use client";

import type { MouseEvent } from "react";

import { ImageIcon, X } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";

import styles from "./product-preview.module.css";

interface ProductPreviewProps {
  images: string[] | null | undefined;
}

export const ProductPreview = ({ images }: ProductPreviewProps) => {
  const safeImages = useMemo(
    () => (Array.isArray(images) ? images.filter((img): img is string => typeof img === "string" && img.trim() !== "") : []),
    [images],
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const activeIndex =
    safeImages.length > 0 ? Math.min(currentIndex, safeImages.length - 1) : 0;
  const activeImage = safeImages[activeIndex] ?? null;

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (safeImages.length <= 1) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const sectionWidth = rect.width / safeImages.length;
    const index = Math.floor(x / sectionWidth);

    setCurrentIndex(Math.min(index, safeImages.length - 1));
  };

  const handleMouseLeave = () => {
    setCurrentIndex(0);
  };

  const handleImageClick = (e: MouseEvent<HTMLImageElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (activeImage) {
      setIsFullScreen(true);
    }
  };

  const closeFullScreen = () => {
    setIsFullScreen(false);
  };

  if (!activeImage) {
    return (
      <div className={styles.preview} data-slot="product-preview">
        <div className={styles.emptyPreview}>
          <ImageIcon className={styles.emptyIcon} />
          <span className={styles.emptyText}>Нет фото</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        className={styles.preview}
        data-slot="product-preview"
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
      >
        <div
          className={styles.previewBlur}
          style={{
            backgroundImage: `url(${activeImage})`,
          }}
        />

        <Image
          fill
          key={activeIndex}
          alt={activeImage}
          className={styles.previewImage}
          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
          src={activeImage}
          style={{ cursor: "pointer" }}
          onClick={handleImageClick}
        />

        {safeImages.length > 1 && (
          <div className={styles.dotsWrapper}>
            {safeImages.map((img, index) => (
              <div key={`dot-${img}-${index}`} className={styles.dot} data-active={index === activeIndex} />
            ))}
          </div>
        )}
      </div>

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
              alt={activeImage}
              className="object-contain"
              sizes="100vw"
              src={activeImage}
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          {safeImages.length > 1 && (
            <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 gap-2">
              {safeImages.map((img, index) => (
                <button
                  key={`fullscreen-dot-${img}-${index}`}
                  className={`h-3 w-3 rounded-full transition-all ${
                    index === activeIndex ? "bg-white" : "bg-white/50 hover:bg-white/75"
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
