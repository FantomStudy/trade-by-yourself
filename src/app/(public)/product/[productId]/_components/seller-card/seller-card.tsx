"use client";

import type { ExtendedProduct } from "@/types";
import { CircleSmall, Phone, StarIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { useStartChatMutation } from "@/api/hooks";
import { Badge, Typography } from "@/components/ui";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";

import { ReservationForm } from "../reservation-form/reservation-form";
import { SecureDealForm } from "../secure-deal-form/secure-deal-form";
import styles from "./seller-card.module.css";

interface SellerCardProps {
  product: ExtendedProduct;
}

export const SellerCard = ({ product }: SellerCardProps) => {
  const router = useRouter();
  const [showPhone, setShowPhone] = useState(false);
  const [shareLabel, setShareLabel] = useState("РџРѕРґРµР»РёС‚СЊСЃСЏ РїСЂРѕС„РёР»РµРј");
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

  const handleShareProfile = async () => {
    if (typeof window === "undefined") return;
    const profileUrl = `${window.location.origin}/seller/${product.seller.id}`;

    try {
      await navigator.clipboard.writeText(profileUrl);
      setShareLabel("РЎСЃС‹Р»РєР° СЃРєРѕРїРёСЂРѕРІР°РЅР°");
    } catch {
      setShareLabel("РќРµ СѓРґР°Р»РѕСЃСЊ СЃРєРѕРїРёСЂРѕРІР°С‚СЊ");
    } finally {
      setTimeout(setShareLabel, 1800, "РџРѕРґРµР»РёС‚СЊСЃСЏ РїСЂРѕС„РёР»РµРј");
    }
  };

  const isLegalEntity = product.seller.profileType === "Р®СЂРёРґРёС‡РµСЃРєРѕРµ Р»РёС†Рѕ";

  return (
    <div className={styles.card}>
      <Link href={`/seller/${product.seller.id}`} className={styles.userInfo}>
        <Avatar size="lg" src={product.seller.photo} fallback={product.seller.fullName} />
        <Typography variant="h2">{product.seller.fullName}</Typography>
      </Link>

      <div className={styles.stats}>
        <div className={styles.ratingSection}>
          <Typography className={styles.rating}>
            {product.seller.rating.toFixed(1)}
            <StarIcon fill="currentColor" />
          </Typography>

          <Typography className={styles.reviews}>{product.seller.reviewsCount} РѕС‚Р·С‹РІРѕРІ</Typography>
        </div>

        <Badge className={styles.profileType} variant={isLegalEntity ? "secondary" : "primary"}>
          <CircleSmall fill="currentColor" />
          {product.seller.profileType}
        </Badge>
      </div>

      <div className={styles.actions}>
        <ReservationForm product={product} />
        <SecureDealForm product={product} />

        <Button disabled={startChatMutation.isPending} variant="success" onClick={handleStartChat}>
          {startChatMutation.isPending ? "Р—Р°РіСЂСѓР·РєР°..." : "РќР°РїРёСЃР°С‚СЊ РїСЂРѕРґР°РІС†Сѓ"}
        </Button>

        <Button onClick={handleShowPhone}>
          <Phone className={styles.icon} />
          {showPhone && product.seller.phoneNumber ? product.seller.phoneNumber : "РџРѕРєР°Р·Р°С‚СЊ РЅРѕРјРµСЂ"}
        </Button>

        <Button variant="outline" onClick={handleShareProfile}>
          {shareLabel}
        </Button>
      </div>
    </div>
  );
};
