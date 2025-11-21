"use client";

import type { ButtonVariant } from "@/components/ui";

import clsx from "clsx";
import { HeartIcon } from "lucide-react";
import { useState } from "react";

import { useFavoriteMutation } from "@/api/hooks";
import { Button } from "@/components/ui";

import styles from "./like-button.module.css";

interface LikeButtonProps {
  className?: string;
  initLiked?: boolean;
  productId: number;
  variant?: ButtonVariant;
}

export const LikeButton = ({
  initLiked = false,
  variant = "ghost",
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
      variant={variant}
      onClick={handleToggle}
    >
      <HeartIcon
        className={clsx(styles.heart, isLiked ? styles.liked : styles.notLiked)}
      />
    </Button>
  );
};
