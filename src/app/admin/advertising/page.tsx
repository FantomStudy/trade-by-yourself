"use client";

import { BannerSelector } from "./_components/banner-selector";

const AdvertisingPage = () => {
  return (
    <div className="space-y-6">
      <div className="rounded-lg bg-white p-4 shadow-sm sm:p-6">
        <BannerSelector />
      </div>
    </div>
  );
};

export default AdvertisingPage;
