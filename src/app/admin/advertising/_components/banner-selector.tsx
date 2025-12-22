"use client";

import Image from "next/image";
import { useRef, useState } from "react";

import { Button, Typography } from "@/components/ui";

interface BannerSize {
  id: string;
  description: string;
  height: number;
  price: number;
  width: number;
}

const BANNER_SIZES: BannerSize[] = [
  {
    id: "mobile",
    width: 320,
    height: 400,
    price: 5000,
    description: "Мобильный баннер - для показа на мобильных устройствах",
  },
  {
    id: "medium",
    width: 660,
    height: 400,
    price: 8000,
    description: "Средний баннер - для планшетов и небольших экранов",
  },
  {
    id: "large",
    width: 1280,
    height: 400,
    price: 12000,
    description: "Большой баннер - полноразмерный баннер на главной странице",
  },
  {
    id: "wide",
    width: 1280,
    height: 200,
    price: 7000,
    description: "Широкий баннер - горизонтальный баннер в шапке",
  },
];

export const BannerSelector = () => {
  const [selectedBanners, setSelectedBanners] = useState<string[]>([]);
  const [bannerImages, setBannerImages] = useState<Record<string, string>>({});
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const handleSelect = (bannerId: string) => {
    setSelectedBanners((prev) =>
      prev.includes(bannerId)
        ? prev.filter((id) => id !== bannerId)
        : [...prev, bannerId],
    );
  };

  const handleImageUpload = (
    bannerId: string,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setBannerImages((prev) => ({ ...prev, [bannerId]: imageUrl }));
    }
  };

  const triggerFileInput = (bannerId: string) => {
    fileInputRefs.current[bannerId]?.click();
  };

  const handleOrder = () => {
    if (selectedBanners.length === 0) {
      alert("Выберите хотя бы один размер баннера");
      return;
    }
    const banners = BANNER_SIZES.filter((b) => selectedBanners.includes(b.id));
    const totalPrice = banners.reduce((sum, b) => sum + b.price, 0);
    const bannersInfo = banners.map((b) => `${b.width}x${b.height}`).join(", ");
    alert(
      `Заказ баннеров: ${bannersInfo}\nОбщая стоимость: ${totalPrice.toLocaleString("ru-RU")} ₽/месяц`,
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <Typography className="text-xl font-semibold">
          Выберите размер баннера
        </Typography>
        <Typography className="mt-1 text-sm text-gray-500">
          Разные размеры баннеров имеют разную стоимость размещения
        </Typography>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {BANNER_SIZES.map((banner) => (
          <div
            key={banner.id}
            className={`cursor-pointer rounded-lg border-2 p-6 transition-all hover:shadow-md ${
              selectedBanners.includes(banner.id)
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 bg-white"
            }`}
            onClick={() => handleSelect(banner.id)}
          >
            <input
              ref={(el) => (fileInputRefs.current[banner.id] = el)}
              accept="image/*"
              className="hidden"
              type="file"
              onChange={(e) => handleImageUpload(banner.id, e)}
            />

            <div className="mb-4 flex items-start justify-between">
              <div>
                <Typography className="text-lg font-semibold">
                  {banner.width} × {banner.height}
                </Typography>
                <Typography className="text-sm text-gray-500">
                  {banner.description}
                </Typography>
              </div>
              {selectedBanners.includes(banner.id) && (
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500">
                  <svg
                    className="h-4 w-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M5 13l4 4L19 7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                    />
                  </svg>
                </div>
              )}
            </div>

            <div
              style={{
                height: `${Math.min(banner.height / 3, 150)}px`,
                minHeight: "100px",
              }}
              className="group relative mb-4 flex items-center justify-center overflow-hidden rounded border border-gray-300 bg-gray-50"
              onClick={(e) => {
                e.stopPropagation();
                triggerFileInput(banner.id);
              }}
            >
              {bannerImages[banner.id] ? (
                <>
                  <Image
                    fill
                    alt={`Баннер ${banner.width}x${banner.height}`}
                    className="object-cover"
                    src={bannerImages[banner.id]}
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                    <Typography className="text-sm text-white">
                      Изменить изображение
                    </Typography>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <svg
                    className="h-8 w-8 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M12 4v16m8-8H4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                    />
                  </svg>
                  <Typography className="text-xs text-gray-400">
                    {banner.width} × {banner.height}
                  </Typography>
                  <Typography className="text-xs text-gray-500">
                    Загрузить изображение
                  </Typography>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between">
              <Typography className="text-2xl font-bold text-gray-900">
                {banner.price.toLocaleString("ru-RU")} ₽
              </Typography>
              <Typography className="text-sm text-gray-500">в месяц</Typography>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4">
        <div>
          {selectedBanners.length > 0 ? (
            <>
              <Typography className="font-semibold">
                Выбрано баннеров: {selectedBanners.length}
              </Typography>
              <Typography className="text-sm text-gray-600">
                Общая стоимость:{" "}
                {BANNER_SIZES.filter((b) => selectedBanners.includes(b.id))
                  .reduce((sum, b) => sum + b.price, 0)
                  .toLocaleString("ru-RU")}{" "}
                ₽/месяц
              </Typography>
            </>
          ) : (
            <Typography className="text-gray-500">
              Выберите размер баннера
            </Typography>
          )}
        </div>
        <Button
          disabled={selectedBanners.length === 0}
          variant="default"
          onClick={handleOrder}
        >
          Заказать размещение
        </Button>
      </div>
    </div>
  );
};
