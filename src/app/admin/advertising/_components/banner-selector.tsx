"use client";

import type { Banner, BannerPlace } from "@/api/types/banner";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import {
  createBanner,
  deleteBanner,
  getBanners,
  updateBanner,
} from "@/api/requests/banner";
import { Button, Typography } from "@/components/ui";

interface BannerConfig {
  description: string;
  height: number;
  place: BannerPlace;
  width: number;
}

const BANNER_CONFIGS: BannerConfig[] = [
  {
    place: "product_feed",
    width: 320,
    height: 400,
    description: "Баннер в ленте карточек",
  },
  {
    place: "profile",
    width: 660,
    height: 400,
    description: "Баннер в профиле пользователя",
  },
  {
    place: "chats",
    width: 1280,
    height: 400,
    description: "Баннер среди чатов",
  },
  {
    place: "favorites",
    width: 1280,
    height: 200,
    description: "Баннер под карточками в профиле",
  },
];

// Маппинг API формата (uppercase) в наш формат (lowercase)
const placeToAPI: Record<BannerPlace, string> = {
  product_feed: "PRODUCT_FEED",
  profile: "PROFILE",
  chats: "CHATS",
  favorites: "FAVORITES",
};

const placeFromAPI: Record<string, BannerPlace> = {
  PRODUCT_FEED: "product_feed",
  PROFILE: "profile",
  CHATS: "chats",
  FAVORITES: "favorites",
};

export const BannerSelector = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadingPlace, setUploadingPlace] = useState<BannerPlace | null>(
    null,
  );
  const [previewImages, setPreviewImages] = useState<
    Record<BannerPlace, string | null>
  >({
    product_feed: null,
    profile: null,
    chats: null,
    favorites: null,
  });
  const [bannerNames, setBannerNames] = useState<Record<BannerPlace, string>>({
    product_feed: "",
    profile: "",
    chats: "",
    favorites: "",
  });
  const [bannerUrls, setBannerUrls] = useState<Record<BannerPlace, string>>({
    product_feed: "",
    profile: "",
    chats: "",
    favorites: "",
  });
  const fileInputRefs = useRef<Record<BannerPlace, HTMLInputElement | null>>({
    product_feed: null,
    profile: null,
    chats: null,
    favorites: null,
  });

  useEffect(() => {
    loadBanners();
  }, []);

  const loadBanners = async () => {
    try {
      setLoading(true);
      const data = await getBanners();
      setBanners(data);

      // Заполняем поля name и navigateToUrl из существующих баннеров
      const names: Record<BannerPlace, string> = {
        product_feed: "",
        profile: "",
        chats: "",
        favorites: "",
      };
      const urls: Record<BannerPlace, string> = {
        product_feed: "",
        profile: "",
        chats: "",
        favorites: "",
      };

      data.forEach((banner) => {
        const place = placeFromAPI[banner.place];
        if (place) {
          names[place] = banner.name;
          urls[place] = banner.navigateToUrl;
        }
      });

      setBannerNames(names);
      setBannerUrls(urls);
    } catch (error) {
      console.error("Ошибка загрузки баннеров:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageSelect = (
    place: BannerPlace,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Создаем preview
    const imageUrl = URL.createObjectURL(file);
    setPreviewImages((prev) => ({ ...prev, [place]: imageUrl }));
  };

  const handleUpload = async (place: BannerPlace) => {
    const fileInput = fileInputRefs.current[place];
    const file = fileInput?.files?.[0];

    if (!file) {
      alert("Выберите изображение");
      return;
    }

    const name = bannerNames[place]?.trim();
    const navigateToUrl = bannerUrls[place]?.trim();

    if (!name) {
      alert("Введите название баннера");
      return;
    }

    if (!navigateToUrl) {
      alert("Введите URL для перехода");
      return;
    }

    // Простая валидация URL
    try {
      new URL(navigateToUrl);
    } catch {
      alert("Введите корректный URL (например, https://example.com)");
      return;
    }

    const config = BANNER_CONFIGS.find((c) => c.place === place);
    if (!config) return;

    try {
      setUploadingPlace(place);

      // Проверяем, есть ли уже баннер для этого места
      const existingBanner = getBannerForPlace(place);

      if (existingBanner) {
        // Обновляем существующий баннер через PUT /banner/{id}
        await updateBanner(existingBanner.id, {
          image: file,
          name,
          navigateToUrl,
        });
      } else {
        // Создаем новый баннер
        await createBanner({
          image: file,
          place,
          name,
          navigateToUrl,
        });
      }

      // Перезагружаем список баннеров
      await loadBanners();

      // Очищаем preview и input
      setPreviewImages((prev) => ({ ...prev, [place]: null }));
      if (fileInput) fileInput.value = "";

      alert("Баннер успешно загружен!");
    } catch (error) {
      console.error("Ошибка загрузки баннера:", error);
      alert("Ошибка при загрузке баннера");
    } finally {
      setUploadingPlace(null);
    }
  };

  const handleDelete = async (place: BannerPlace) => {
    const banner = getBannerForPlace(place);
    if (!banner) return;

    if (!confirm("Вы уверены, что хотите удалить этот баннер?")) return;

    try {
      await deleteBanner(banner.id);
      await loadBanners();

      // Очищаем поля
      setBannerNames((prev) => ({ ...prev, [place]: "" }));
      setBannerUrls((prev) => ({ ...prev, [place]: "" }));

      alert("Баннер успешно удален!");
    } catch (error) {
      console.error("Ошибка удаления баннера:", error);
      alert("Ошибка при удалении баннера");
    }
  };

  const triggerFileInput = (place: BannerPlace) => {
    fileInputRefs.current[place]?.click();
  };

  const getBannerForPlace = (place: BannerPlace) => {
    const apiPlace = placeToAPI[place];
    return banners.find((b) => b.place === apiPlace);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Typography>Загрузка...</Typography>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Typography className="text-xl font-semibold">
          Управление баннерами
        </Typography>
        <Typography className="mt-1 text-sm text-gray-500">
          Загрузите изображения точно указанных размеров для каждого типа
          баннера
        </Typography>
      </div>

      <div className="flex flex-col gap-6">
        {BANNER_CONFIGS.map((config) => {
          const existingBanner = getBannerForPlace(config.place);
          const previewImage = previewImages[config.place];
          const currentImage = previewImage || existingBanner?.photoUrl;
          const isUploading = uploadingPlace === config.place;

          return (
            <div
              key={config.place}
              className="rounded-lg border-2 border-gray-200 bg-white p-6"
              style={{ width: `${config.width + 60}px` }}
            >
              <input
                ref={(el) => {
                  fileInputRefs.current[config.place] = el;
                }}
                accept="image/*"
                className="hidden"
                type="file"
                onChange={(e) => handleImageSelect(config.place, e)}
              />

              <div className="mb-4 flex items-start justify-between">
                <div>
                  <Typography className="text-lg font-semibold">
                    {config.width} × {config.height}
                  </Typography>
                  <Typography className="text-sm text-gray-500">
                    {config.description}
                  </Typography>
                </div>
                {existingBanner && (
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(config.place)}
                  >
                    Удалить
                  </Button>
                )}
              </div>

              {/* Preview с точными размерами */}
              <div className="mb-4 overflow-auto">
                <div
                  style={{
                    width: `${config.width}px`,
                    height: `${config.height}px`,
                    position: "relative",
                  }}
                  className="group cursor-pointer rounded border border-gray-300 bg-gray-50"
                  onClick={() => triggerFileInput(config.place)}
                >
                  {currentImage ? (
                    <>
                      <Image
                        fill
                        alt={`Баннер ${config.width}x${config.height}`}
                        className="object-cover"
                        src={currentImage}
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                        <Typography className="text-sm text-white">
                          Изменить изображение
                        </Typography>
                      </div>
                    </>
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
                      <svg
                        className="h-12 w-12 text-gray-400"
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
                      <Typography className="font-medium text-gray-600">
                        {config.width} × {config.height}
                      </Typography>
                      <Typography className="text-xs text-gray-500">
                        Нажмите, чтобы выбрать изображение
                      </Typography>
                    </div>
                  )}
                </div>
              </div>

              {/* Поля для ввода названия и URL */}
              <div className="mb-4 space-y-3">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Название баннера
                  </label>
                  <input
                    type="text"
                    placeholder="Например: Google Browser"
                    value={bannerNames[config.place]}
                    onChange={(e) =>
                      setBannerNames((prev) => ({
                        ...prev,
                        [config.place]: e.target.value,
                      }))
                    }
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    URL для перехода
                  </label>
                  <input
                    type="url"
                    placeholder="https://example.com"
                    value={bannerUrls[config.place]}
                    onChange={(e) =>
                      setBannerUrls((prev) => ({
                        ...prev,
                        [config.place]: e.target.value,
                      }))
                    }
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  className="flex-1"
                  disabled={isUploading}
                  variant="outline"
                  onClick={() => triggerFileInput(config.place)}
                >
                  {existingBanner ? "Изменить изображение" : "Выбрать файл"}
                </Button>
                {previewImage && (
                  <Button
                    className="flex-1"
                    disabled={isUploading}
                    onClick={() => handleUpload(config.place)}
                  >
                    {isUploading ? "Загрузка..." : "Загрузить"}
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
