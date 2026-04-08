"use client";

import type { ButtonProps } from "@/components/ui";
import clsx from "clsx";
import { HeartIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui";
import { useLike } from "./useLike";
import styles from "./LikeButton.module.css";

interface LikeButtonProps extends ButtonProps {
  initLiked?: boolean;
  productId: number;
}

export const LikeButton = ({ initLiked, productId, ...props }: LikeButtonProps) => {
  const [isLiked, setIsLiked] = useState(initLiked);

  const like = useLike(productId);

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
