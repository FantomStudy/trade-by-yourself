"use client";

import clsx from "clsx";
import { Heart } from "lucide-react";
import { useState } from "react";

import { safe } from "@/app/(feed)/(search)/_lib/utils/safe";

import { toggleFavorite } from "../../api";

import styles from "./like-button.module.css";
import { Button } from "@/components/ui-lab/Button";

interface LikeButtonProps {
  className?: string;
  initLiked: boolean;
  productId: number;
}

export const LikeButton = ({
  initLiked = false,
  productId,
  className,
}: LikeButtonProps) => {
  const [isLiked, setIsLiked] = useState(initLiked);

  const toggle = async () => {
    const newLiked = !isLiked;
    setIsLiked(newLiked);

    const result = await safe(toggleFavorite(productId, newLiked));
    if (!result.success) {
      setIsLiked(!newLiked);
    }
  };

  return (
    <Button
      className={clsx(styles.button, className)}
      size="icon-sm"
      variant="ghost"
      onClick={toggle}
    >
      <Heart className={styles.heart} data-active={isLiked} />
    </Button>
  );
};
