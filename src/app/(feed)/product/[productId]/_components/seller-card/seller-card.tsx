"use client";
import type { ExtendedProduct } from "@/types";

import { CircleSmall, Phone, StarIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { useStartChatMutation } from "@/api/hooks";
import { Avatar, Badge, Button, Typography } from "@/components/ui";

import styles from "./seller-card.module.css";

interface SellerCardProps {
  product: ExtendedProduct;
}

export const SellerCard = ({ product }: SellerCardProps) => {
  const router = useRouter();
  const [showPhone, setShowPhone] = useState(false);
  const startChatMutation = useStartChatMutation();

  const handleShowPhone = () => {
    setShowPhone((prev) => !prev);
  };

  const handleStartChat = async () => {
    try {
      const result = await startChatMutation.mutateAsync({
        productId: product.id,
      });
      const chatId = result.chatId || result.id;
      if (chatId) {
        router.push(`/profile/messages/${chatId}` as any);
      } else {
        console.error("No chat ID in response:", result);
      }
    } catch (error) {
      console.error("Failed to start chat:", error);
    }
  };

  const isLegalEntity = product.seller.profileType === "Юридическое лицо";

  return (
    <div className={styles.card}>
      <div className={styles.userInfo}>
        <Avatar fullName={product.seller.fullName} size="lg" />
        <Typography variant="h2">{product.seller.fullName}</Typography>
      </div>

      <div className={styles.stats}>
        <div className={styles.ratingSection}>
          <Typography className={styles.rating}>
            {product.seller.rating.toFixed(1)}
            <StarIcon fill="currentColor" />
          </Typography>

          <Typography className={styles.reviews}>
            {product.seller.reviewsCount} отзывов
          </Typography>
        </div>

        <Badge
          className={styles.profileType}
          variant={isLegalEntity ? "secondary" : "primary"}
        >
          <CircleSmall fill="currentColor" />
          {product.seller.profileType}
        </Badge>
      </div>

      <div className={styles.actions}>
        <Button
          disabled={startChatMutation.isPending}
          variant="secondary"
          onClick={handleStartChat}
        >
          {startChatMutation.isPending ? "Загрузка..." : "Написать продавцу"}
        </Button>

        <Button onClick={handleShowPhone}>
          <Phone className={styles.icon} />
          {showPhone && product.seller.phoneNumber
            ? product.seller.phoneNumber
            : "Показать номер"}
        </Button>
      </div>
    </div>
  );
};
