"use client";

import { Phone } from "lucide-react";

import { UserAvatar } from "@/components";
import { Button } from "@/components/ui";

interface SellerSidebarProps {
  seller: {
    id: number;
    name: string;
    avatar?: string;
    isVerified?: boolean;
    rating: number;
    reviewsCount: number;
  };
}

export const SellerSidebar = ({ seller }: SellerSidebarProps) => {
  const handleStartSale = () => {
    // Логика начала продажи
    console.log("Начать продажу");
  };

  const handleShowPhone = () => {
    // Логика показа телефона
    console.log("Показать номер телефона");
  };

  return (
    <div className="bg-background flex flex-col items-center gap-6 rounded-lg border border-gray-200 px-6 py-8 shadow-sm">
      {/* Аватар и имя продавца */}
      <div className="flex flex-col items-center gap-3">
        <UserAvatar fullName={seller.name} size="lg" src={seller.avatar} />
        <h2 className="text-center text-xl font-semibold">{seller.name}</h2>
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

        {/* Зелёный значок "Юридическое лицо" */}
        <div className="flex items-center gap-2 rounded-full bg-green-50 px-3 py-1">
          <div className="h-2 w-2 rounded-full bg-green-500"></div>
          <span className="text-sm font-medium text-green-700">
            Юридическое лицо
          </span>
        </div>
      </div>

      {/* Кнопки действий */}
      <div className="flex w-full flex-col gap-3">
        <Button
          className="w-full bg-green-500 py-6 text-base font-medium hover:bg-green-600"
          onClick={handleStartSale}
        >
          Написать продавцу
        </Button>

        <Button
          className="w-full border-2 border-blue-500 bg-blue-500 py-6 text-base font-medium text-blue-500 text-white hover:bg-blue-600"
          variant="secondary"
          onClick={handleShowPhone}
        >
          <Phone className="mr-2 h-5 w-5" />
          Показать номер
        </Button>
      </div>
    </div>
  );
};
