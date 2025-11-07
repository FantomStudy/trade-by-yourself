"use client";

import Image from "next/image";
import React, { useRef, useState } from "react";

import styles from "./ImageUpload.module.css";

interface ImageUploadProps {
  maxImages?: number;
  onImagesChange?: (images: File[]) => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  maxImages = 6,
  onImagesChange,
}) => {
  const [images, setImages] = useState<File[]>([]);
  const [mainImageIndex, setMainImageIndex] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const newImages = [...images, ...files].slice(0, maxImages);
    setImages(newImages);
    onImagesChange?.(newImages);
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    onImagesChange?.(newImages);

    // Adjust main image index if needed
    if (index === mainImageIndex && newImages.length > 0) {
      setMainImageIndex(0);
    } else if (index < mainImageIndex) {
      setMainImageIndex(mainImageIndex - 1);
    } else if (mainImageIndex >= newImages.length) {
      setMainImageIndex(Math.max(0, newImages.length - 1));
    }
  };

  const setAsMainImage = (index: number) => {
    setMainImageIndex(index);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={styles.container}>
      <div className={styles.section}>
        <div className={styles.imagesRow}>
          {/* Existing images */}
          {images.map((image, index) => (
            <div
              key={index}
              className={`${styles.imageContainer} ${
                index === mainImageIndex ? styles.mainImageMarker : ""
              }`}
              onClick={() => setAsMainImage(index)}
            >
              <Image
                fill
                alt={`Фото ${index + 1}`}
                className={styles.image}
                src={URL.createObjectURL(image)}
                style={{ objectFit: "cover" }}
              />
              <button
                type="button"
                className={styles.removeButton}
                onClick={(e) => {
                  e.stopPropagation();
                  removeImage(index);
                }}
              >
                🗑️
              </button>
              {index === mainImageIndex && (
                <div className={styles.mainImageBadge}>Основное</div>
              )}
            </div>
          ))}

          {/* Add new image placeholder */}
          {images.length < maxImages && (
            <div
              className={styles.addImageContainer}
              onClick={triggerFileInput}
            >
              <div className={styles.placeholderIcon}>📷</div>
              <span className={styles.addText}>Добавить фото</span>
            </div>
          )}
        </div>

        <input
          multiple
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleFileSelect}
        />
      </div>
    </div>
  );
};
