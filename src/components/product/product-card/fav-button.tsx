"use client";

import { useState } from "react";

import { Button, HeartIcon } from "@/components/ui";
import { cn } from "@/lib/utils";

import { useFavorite } from "./useFavorite";

interface FavButtonProps {
  className?: string;
  initFav?: boolean;
  productId: number;
}

export const FavButton = ({
  initFav = false,
  productId,
  className,
}: FavButtonProps) => {
  const [isLiked, setIsLiked] = useState(initFav);

  const { toggle, isLoading } = useFavorite({
    productId,
    onSuccess: (liked) => {
      setIsLiked(liked);
    },
    onError: (error) => {
      setIsLiked(!isLiked);
      console.error("Failed to toggle favorite:", error);
    },
  });

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isLoading) return;

    const newLikedState = !isLiked;
    setIsLiked(newLikedState);

    toggle({ isLiked: newLikedState });
  };

  return (
    <Button
      aria-label={isLiked ? "Убрать из избранного" : "Добавить в избранное"}
      className={className}
      disabled={isLoading}
      size="icon"
      variant="ghost"
      onClick={handleToggle}
    >
      <HeartIcon
        className={cn(
          "transition-all duration-200",
          `stroke-${isLiked ? 1.5 : 2}`,
          isLiked
            ? "fill-pink text-pink"
            : "text-muted-foreground hover:text-pink",
          isLoading ? "scale-95 opacity-50" : "hover:scale-110",
        )}
      />
    </Button>
  );
};
