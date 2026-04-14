"use client";

import type { ButtonProps } from "@/components/ui";
import { useMutation } from "@tanstack/react-query";
import clsx from "clsx";
import { HeartIcon } from "lucide-react";
import { useState } from "react";
import { addFavorite, deleteFavorite } from "@/api/products";
import { Button } from "@/components/ui";
import styles from "./LikeButton.module.css";

interface LikeButtonProps extends ButtonProps {
  initLiked?: boolean;
  productId: number;
}

export const LikeButton = ({ initLiked, productId, ...props }: LikeButtonProps) => {
  const [isLiked, setIsLiked] = useState(initLiked);

  const like = useMutation({
    mutationFn: async (isLiked: boolean) => {
      if (isLiked) {
        await addFavorite(productId);
      } else {
        await deleteFavorite(productId);
      }
    },
  });

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();

    if (like.isPending) return;

    const newLikedState = !isLiked;
    setIsLiked(newLikedState);

    like.mutate(newLikedState, {
      onError: (error) => {
        setIsLiked(!newLikedState);
        console.error("Failed to like product:", error);
      },
    });
  };

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      disabled={like.isPending}
      onClick={handleToggle}
      aria-label={isLiked ? "Убрать из избранного" : "Добавить в избранное"}
      {...props}
    >
      <HeartIcon className={clsx(styles.heart, isLiked && styles.liked)} />
    </Button>
  );
};
