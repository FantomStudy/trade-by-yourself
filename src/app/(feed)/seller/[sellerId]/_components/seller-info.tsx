"use client";
import type { User } from "@/types";

import { CircleSmall, Phone, StarIcon } from "lucide-react";
import { useState } from "react";

import { Badge, Typography } from "@/components/ui";
import { Avatar } from "@/components/ui-lab/Avatar";
import { Button } from "@/components/ui-lab/Button";
import styles from "./seller-info.module.css";

interface SellerInfoProps {
  seller: User;
}

export const SellerInfo = ({ seller }: SellerInfoProps) => {
  const [showPhone, setShowPhone] = useState(false);
  const isLegalEntity = seller.profileType === "Юридическое лицо";

  const handleShowPhone = () => {
    setShowPhone((prev) => !prev);
  };

  return (
    <div className={styles.card}>
      <div className={styles.userInfo}>
        <Avatar fullName={seller.fullName} size="lg" />
        <Typography variant="h2">{seller.fullName}</Typography>
      </div>

      <div className={styles.stats}>
        <div className={styles.ratingSection}>
          <Typography className={styles.rating}>
            {seller.rating?.toFixed(1) || "0.0"}
            <StarIcon fill="currentColor" />
          </Typography>

          <Typography className={styles.reviews}>
            {seller.reviewsCount || 0} отзывов
          </Typography>
        </div>

        <Badge
          className={styles.profileType}
          variant={isLegalEntity ? "secondary" : "primary"}
        >
          <CircleSmall fill="currentColor" />
          {seller.profileType}
        </Badge>
      </div>

      <div className={styles.actions}>
        <Button onClick={handleShowPhone}>
          <Phone className={styles.icon} />
          {showPhone && seller.phoneNumber
            ? seller.phoneNumber
            : "Показать номер"}
        </Button>
      </div>
    </div>
  );
};
