"use client";

import { Typography } from "@/components/ui";

import { MobileHeader } from "../_components/admin-sidebar";
import { BannerSelector } from "./_components/banner-selector";

const AdvertisingPage = () => {
  return (
    <div className="space-y-6">
      <MobileHeader title="Управление рекламой" />
      <div>
        <Typography className="text-xl font-bold sm:text-2xl">
          Управление рекламой
        </Typography>
        <Typography className="mt-1 text-sm text-gray-600">
          Настройка баннеров на сайте
        </Typography>
      </div>
      <div className="rounded-lg bg-white p-4 shadow-sm sm:p-6">
        <BannerSelector />
      </div>
    </div>
  );
};

export default AdvertisingPage;
