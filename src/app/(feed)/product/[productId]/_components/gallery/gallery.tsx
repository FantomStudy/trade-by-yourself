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
    <div className={styles.gallery}>
      <div>
        
      </div>
      <Image
        alt="Изображение продукта"
        className={styles.mainFrame}
        height={400}
        src={images[currentImageIndex]}
        width={400}
      />

      {images.length > 1 && (
        <>
          <div className={styles.thumbnails}>
            {images.map((image, index) => (
              <button
                key={image}
                className={styles.thumbnail}
                data-active={index === currentImageIndex}
                type="button"
                onClick={() => setCurrentImageIndex(index)}
              >
                <Image fill alt={image} src={image} />
              </button>
            ))}
          </div>

          <Button
            className={clsx(styles.navButton, styles.prevButton)}
            variant="ghost"
            onClick={prevImage}
          >
            <MoveLeft />
          </Button>
          <Button
            className={clsx(styles.navigationButton, styles.nextButton)}
            size="icon"
            variant="ghost"
            onClick={nextImage}
          >
            <MoveRight />
          </Button>
        </>
      )}
    </div>
  );
};
