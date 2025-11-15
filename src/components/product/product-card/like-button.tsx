"use client";

import { useState } from "react";

import { useFavoriteMutation } from "@/api/hooks";
import { Button, HeartIcon } from "@/components/ui";
import { cn } from "@/lib/utils";

interface LikeButtonProps {
  className?: string;
  initLiked?: boolean;
  productId: number;
}

export const LikeButton = ({
  initLiked = false,
  productId,
  className,
}: LikeButtonProps) => {
  const [isLiked, setIsLiked] = useState(initLiked);

  const { mutate, isPending } = useFavoriteMutation(productId);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isPending) return;

    const newLikedState = !isLiked;
    setIsLiked(newLikedState);

    mutate(
      { isLiked: newLikedState },
      {
        onSuccess: (liked) => {
          setIsLiked(liked);
        },
        onError: (error) => {
          setIsLiked(!isLiked);
          console.error("Failed to toggle favorite:", error);
        },
      },
    );
  };

  return (
    <Button
      aria-label={isLiked ? "Убрать из избранного" : "Добавить в избранное"}
      className={className}
      disabled={isPending}
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
          isPending ? "scale-95 opacity-50" : "hover:scale-110",
        )}
      />
    </Button>
  );
};
