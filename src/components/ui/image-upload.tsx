"use client";

import Image from "next/image";
import * as React from "react";
import { useRef, useState } from "react";

import {
  MAX_IMAGE_FILE_SIZE_MB,
  MAX_TOTAL_IMAGE_SIZE_MB,
  validateImageFiles,
} from "@/lib/media-validation";

interface ImageUploadProps {
  maxImages?: number;
  onImagesChange?: (images: File[]) => void;
  onValidationError?: (message: string | null) => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  maxImages = 6,
  onImagesChange,
  onValidationError,
}) => {
  const [images, setImages] = useState<File[]>([]);
  const [mainImageIndex, setMainImageIndex] = useState<number>(0);
  const [localError, setLocalError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const reorderImagesWithMain = (imagesList: File[], mainIndex: number) => {
    if (mainIndex === 0 || imagesList.length === 0) return imagesList;
    const reordered = [...imagesList];
    const [mainImage] = reordered.splice(mainIndex, 1);
    return [mainImage, ...reordered];
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    const validationError = await validateImageFiles(files, {
      currentCount: images.length,
      currentTotalBytes: images.reduce((sum, file) => sum + file.size, 0),
      maxFiles: maxImages,
    });

    if (validationError) {
      setLocalError(validationError);
      onValidationError?.(validationError);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setLocalError(null);
    onValidationError?.(null);
    const newImages = [...images, ...files].slice(0, maxImages);
    const reordered = reorderImagesWithMain(newImages, mainImageIndex);
    setImages(reordered);
    onImagesChange?.(reordered);
    if (fileInputRef.current) fileInputRef.current.value = "";
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
    // Reorder images so main image is first
    const reordered = reorderImagesWithMain(images, index);
    setImages(reordered);
    onImagesChange?.(reordered);
    setMainImageIndex(0); // After reordering, main is always at index 0
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full max-w-full">
      <div className="mb-8">
        <div className="flex flex-wrap gap-3 md:gap-4">
          {/* Existing images */}
          {images.map((image, index) => (
            <div
              key={`image-${image.name}-${image.lastModified}`}
              className={`relative h-[150px] w-[150px] cursor-pointer overflow-hidden rounded-xl border-2 border-transparent transition-colors duration-200 hover:border-blue-500 md:h-[200px] md:w-[200px] ${
                index === mainImageIndex
                  ? "!border-emerald-500 shadow-[0_0_0_2px_rgba(16,185,129,0.2)]"
                  : ""
              }`}
              tabIndex={0}
              onClick={() => setAsMainImage(index)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setAsMainImage(index);
                }
              }}
              role="button"
            >
              <Image
                fill
                alt={`Фото ${index + 1}`}
                className="rounded-xl"
                src={URL.createObjectURL(image)}
                style={{ objectFit: "cover" }}
              />
              <button
                className="absolute top-2 right-2 z-10 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border-0 bg-red-500/90 text-xs text-white transition-colors duration-200 hover:bg-red-600/90"
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeImage(index);
                }}
              >
                🗑️
              </button>
              {index === mainImageIndex && (
                <div className="absolute bottom-2 left-2 z-10 rounded bg-emerald-500/90 px-2 py-1 text-xs font-medium text-white">
                  Основное
                </div>
              )}
            </div>
          ))}

          {/* Add new image placeholder */}
          {images.length < maxImages && (
            <div
              className="flex h-[150px] w-[150px] cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 transition-all duration-200 hover:border-gray-400 hover:bg-gray-100 md:h-[200px] md:w-[200px]"
              tabIndex={0}
              onClick={triggerFileInput}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  triggerFileInput();
                }
              }}
              role="button"
            >
              <div className="text-4xl text-gray-400 md:text-5xl">📷</div>
              <span className="text-center text-xs font-medium text-gray-500 md:text-sm">
                Добавить фото
              </span>
            </div>
          )}
        </div>

        <input
          multiple
          ref={fileInputRef}
          accept="image/jpeg,image/png,image/webp"
          style={{ display: "none" }}
          type="file"
          onChange={handleFileSelect}
        />
        <div className="mt-3 space-y-1 text-sm text-gray-500">
          <p>Фото: JPG, PNG или WebP.</p>
          <p>
            Размер: до {MAX_IMAGE_FILE_SIZE_MB} МБ на одно фото, общий размер до{" "}
            {MAX_TOTAL_IMAGE_SIZE_MB} МБ.
          </p>
          <p>Соотношение сторон: от 1:2.5 до 2.5:1.</p>
        </div>
        {localError ? <div className="mt-2 text-sm text-red-600">{localError}</div> : null}
      </div>
    </div>
  );
};
