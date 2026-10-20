"use client";

import { useState } from "react";
import { Typography } from "@/components/ui";

import { MobileHeader } from "../_components/admin-sidebar";
import { BannerSelector } from "./_components/banner-selector";
import { BannerModerationList } from "./_components/banner-moderation-list";

const AdvertisingPage = () => {
  const [activeTab, setActiveTab] = useState<"site" | "moderate">("site");

  return (
    <div className="space-y-6">
      <MobileHeader title="Управление рекламой" />
      <div>
        <Typography className="text-xl font-bold sm:text-2xl">Управление рекламой</Typography>
        <Typography className="mt-1 text-sm text-gray-600">
          Настройка баннеров на сайте и модерация рекламных заявок пользователей
        </Typography>
      </div>

      <div className="flex border-b border-gray-200 gap-4">
        <button
          type="button"
          onClick={() => setActiveTab("site")}
          className={`pb-3 text-sm font-medium transition-colors border-b-2 ${
            activeTab === "site"
              ? "border-blue-600 text-blue-600 font-semibold"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Баннеры платформы
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("moderate")}
          className={`pb-3 text-sm font-medium transition-colors border-b-2 ${
            activeTab === "moderate"
              ? "border-blue-600 text-blue-600 font-semibold"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Заявки на модерацию
        </button>
      </div>

      <div className="rounded-lg bg-white p-4 shadow-sm sm:p-6">
        {activeTab === "site" ? <BannerSelector /> : <BannerModerationList />}
      </div>
    </div>
  );
};

export default AdvertisingPage;
