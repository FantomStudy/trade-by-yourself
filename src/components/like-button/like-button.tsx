"use client";

import type { ButtonProps } from "../ui-lab/Button";
import clsx from "clsx";
import { HeartIcon } from "lucide-react";
import { useState } from "react";
import { useFavoriteMutation } from "@/api/hooks";
import { Button } from "../ui-lab/Button";
import styles from "./like-button.module.css";

interface LikeButtonProps extends ButtonProps {
  initLiked?: boolean;
  productId: number;
}

export const LikeButton = ({
  initLiked = false,
  variant = "ghost",
  productId,
  ...props
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
      {...props}
      aria-label={isLiked ? "Убрать из избранного" : "Добавить в избранное"}
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
