"use client";

import { Phone } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { UserAvatar } from "@/components";
import { Button } from "@/components/ui";
import { useStartChatMutation } from "@/lib/api/hooks";

interface SellerSidebarProps {
  productId: number;
  seller: {
    id: number;
    fullName: string;
    phoneNumber?: string;
    profileType?: string;
    rating: number;
    reviewsCount: number;
  };
}

export const SellerSidebar = ({ productId, seller }: SellerSidebarProps) => {
  const router = useRouter();
  const [showPhone, setShowPhone] = useState(false);
  const startChatMutation = useStartChatMutation();

  const handleShowPhone = () => {
    setShowPhone(true);
  };

  const handleStartChat = async () => {
    try {
      const result = await startChatMutation.mutateAsync({ productId });
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

  const isLegalEntity = seller.profileType === "Юридическое лицо";

  return (
    <div className="bg-background flex flex-col items-center gap-6 rounded-lg border border-gray-200 px-6 py-8 shadow-sm">
      {/* Аватар и имя продавца */}
      <div className="flex flex-col items-center gap-3">
        <UserAvatar fullName={seller.fullName} size="lg" />
        <h2 className="text-center text-xl font-semibold">{seller.fullName}</h2>
      </div>

      {/* Рейтинг и значок верификации */}
      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-yellow-500">
            {seller.rating.toFixed(1)}
          </span>
          <span className="text-2xl text-yellow-500">★</span>
          <span className="text-sm text-gray-600">
            {seller.reviewsCount} отзывов
          </span>
        </div>

        {/* Значок типа профиля */}
        {seller.profileType && (
          <div
            className={`flex items-center gap-2 rounded-full px-3 py-1 ${
              isLegalEntity ? "bg-green-50" : "bg-blue-50"
            }`}
          >
            <div
              className={`h-2 w-2 rounded-full ${
                isLegalEntity ? "bg-green-500" : "bg-blue-500"
              }`}
            ></div>
            <span
              className={`text-sm font-medium ${
                isLegalEntity ? "text-green-700" : "text-blue-700"
              }`}
            >
              {seller.profileType}
            </span>
          </div>
        )}
      </div>

      {/* Кнопки действий */}
      <div className="flex w-full flex-col gap-3">
        <Button
          className="w-full bg-green-500 py-6 text-base font-medium hover:bg-green-600"
          disabled={startChatMutation.isPending}
          onClick={handleStartChat}
        >
          {startChatMutation.isPending ? "Загрузка..." : "Написать продавцу"}
        </Button>

        <Button
          className="w-full border-2 border-blue-500 bg-blue-500 py-6 text-base font-medium text-white hover:bg-blue-600"
          variant="secondary"
          onClick={handleShowPhone}
        >
          <Phone className="mr-2 h-5 w-5" />
          {showPhone && seller.phoneNumber
            ? seller.phoneNumber
            : "Показать номер"}
        </Button>
      </div>
    </div>
  );
};
