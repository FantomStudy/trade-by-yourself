"use client";

import type { Product } from "@/types";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { ImageIcon, Typography } from "@/components/ui";
import { formatPrice } from "@/lib/format";

import { LikeButton } from "./like-button";

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = product.images || [];
  const hasMultipleImages = images.length > 1;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!hasMultipleImages) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const sectionWidth = rect.width / images.length;
    const index = Math.floor(x / sectionWidth);

    setCurrentImageIndex(Math.min(index, images.length - 1));
  };

  const handleMouseLeave = () => {
    setCurrentImageIndex(0);
  };

  return (
    <article className="bg-background flex h-full flex-col rounded-md">
      <div
        className="relative aspect-square w-full overflow-hidden rounded-md"
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
      >
        <Link
          href={`/product/${product.id}`}
          className="absolute inset-0 z-20"
        />
        {images.length > 0 ? (
          <>
            <div
              style={{
                backgroundImage: `url(${images[currentImageIndex]})`,
              }}
              className="absolute inset-0 bg-cover bg-center blur-xs grayscale-50"
            />
            <Image
              fill
              key={currentImageIndex}
              alt={product.name}
              className="object-contain transition-opacity duration-200"
              src={images[currentImageIndex]}
            />
            {/* Индикаторы фотографий */}
            {hasMultipleImages && (
              <div className="pointer-events-none absolute bottom-2 left-1/2 z-10 flex -translate-x-1/2 gap-1">
                {images.map((img, index) => (
                  <div
                    key={img}
                    className={`h-1.5 w-1.5 rounded-full transition-all ${
                      index === currentImageIndex
                        ? "w-4 bg-white"
                        : "bg-white/60"
                    }`}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="bg-accent grid size-full place-items-center">
            <ImageIcon className="text-muted-foreground size-16 stroke-1" />
          </div>
        )}
      </div>

      <div className="relative flex flex-1 flex-col gap-2 p-3 pr-10">
        <LikeButton
          className="absolute top-1 right-2"
          initLiked={product.isLiked}
          productId={product.id}
        />

        <Link href={`/product/${product.id}`}>
          <Typography className="hover:text-primary line-clamp-2 text-sm font-medium transition-all">
            {product.name}
          </Typography>
        </Link>

        <div className="mt-auto flex flex-col gap-1">
          <Typography className="text-muted-foreground truncate text-xs">
            {product.address}
          </Typography>
          <Typography className="text-muted-foreground truncate text-xs">
            {product.createdAt}
          </Typography>
        </div>

        <Typography className="text-primary text-lg font-bold">
          {formatPrice(product.price)}
        </Typography>
      </div>
    </article>
  );
};
