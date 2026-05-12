"use client";

import type { Banner, BannerPlace } from "@/api/types/banner";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { createBanner, deleteBanner, getBanners, updateBanner } from "@/api/requests/banner";
import { Typography } from "@/components/ui";
import { Button } from "@/components/ui/Button";

interface BannerConfig {
  description: string;
  height: number;
  place: BannerPlace;
  width: number;
}

const BANNER_CONFIGS: BannerConfig[] = [
  {
    place: "PRODUCT_FEED",
    width: 320,
    height: 400,
    description: "Баннер в ленте карточек",
  },
  {
    place: "PROFILE",
    width: 660,
    height: 400,
    description: "Большой баннер в ленте карточек",
  },
  {
    place: "CHATS",
    width: 1280,
    height: 400,
    description: "Баннер среди чатов",
  },
  {
    place: "FAVORITES",
    width: 1280,
    height: 200,
    description: "Баннер под хедером на главной странице",
  },
];

export const BannerSelector = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [previewImages, setPreviewImages] = useState<Record<string, string | null>>({});
  const [bannerNames, setBannerNames] = useState<Record<string, string>>({});
  const [bannerUrls, setBannerUrls] = useState<Record<string, string>>({});
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  useEffect(() => {
    loadBanners();
  }, []);

  const loadBanners = async () => {
    try {
      setLoading(true);
      const data = await getBanners();
      setBanners(data);

      // Заполняем поля name и navigateToUrl из существующих баннеров
      const names: Record<string, string> = {};
      const urls: Record<string, string> = {};

      data.forEach((banner) => {
        names[banner.id.toString()] = banner.name;
        urls[banner.id.toString()] = banner.navigateToUrl;
      });

      setBannerNames(names);
      setBannerUrls(urls);
    } catch (error) {
      console.error("Ошибка загрузки баннеров:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageSelect = (itemId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Создаем preview
    const imageUrl = URL.createObjectURL(file);
    setPreviewImages((prev) => ({ ...prev, [itemId]: imageUrl }));
  };

  const handleUpload = async (itemId: string, place: BannerPlace, bannerId?: number) => {
    const fileInput = fileInputRefs.current[itemId];
    const file = fileInput?.files?.[0];

    if (!file) {
      alert("Выберите изображение");
      return;
    }

    const name = bannerNames[itemId]?.trim();
    const navigateToUrl = bannerUrls[itemId]?.trim();

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
      setUploadingId(itemId);

      if (bannerId) {
        // Обновляем существующий баннер
        await updateBanner(bannerId, {
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
      setPreviewImages((prev) => ({ ...prev, [itemId]: null }));
      if (fileInput) fileInput.value = "";

      alert("Баннер успешно загружен!");
    } catch (error) {
      console.error("Ошибка загрузки баннера:", error);
      alert("Ошибка при загрузке баннера");
    } finally {
      setUploadingId(null);
    }
  };

  const handleDelete = async (bannerId: number, itemId: string) => {
    if (!confirm("Вы уверены, что хотите удалить этот баннер?")) return;

    try {
      await deleteBanner(bannerId);
      await loadBanners();

      // Очищаем поля
      setBannerNames((prev) => {
        const newNames = { ...prev };
        delete newNames[itemId];
        return newNames;
      });
      setBannerUrls((prev) => {
        const newUrls = { ...prev };
        delete newUrls[itemId];
        return newUrls;
      });

      alert("Баннер успешно удален!");
    } catch (error) {
      console.error("Ошибка удаления баннера:", error);
      alert("Ошибка при удалении баннера");
    }
  };

  const triggerFileInput = (itemId: string) => {
    fileInputRefs.current[itemId]?.click();
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
        <Typography className="text-xl font-semibold">Управление баннерами</Typography>
        <Typography className="mt-1 text-sm text-gray-500">
          Загрузите изображения точно указанных размеров для каждого типа баннера
        </Typography>
      </div>

      <div className="flex flex-col gap-6">
        {BANNER_CONFIGS.map((config) => {
          const existingBanners = banners.filter((b) => b.place === config.place);

          // Создаем items: существующие баннеры + один новый слот
          const items = [
            ...existingBanners.map((banner) => ({
              id: banner.id.toString(),
              banner,
            })),
            { id: `new-${config.place}`, banner: null },
          ];

          return (
            <div key={config.place} className="space-y-4">
              <Typography className="text-base font-semibold sm:text-lg">
                {config.width} × {config.height} - {config.description}
              </Typography>

              {items.map((item) => {
                const itemId = item.id;
                const previewImage = previewImages[itemId];
                const currentImage = previewImage || item.banner?.photoUrl;
                const isUploading = uploadingId === itemId;

                return (
                  <div
                    key={itemId}
                    style={{
                      maxWidth: `${config.width + 60}px`,
                    }}
                    className="w-full rounded-lg border-2 border-gray-200 bg-white p-4 sm:p-6"
                  >
                    <input
                      ref={(el) => {
                        fileInputRefs.current[itemId] = el;
                      }}
                      accept="image/*"
                      className="hidden"
                      type="file"
                      onChange={(e) => handleImageSelect(itemId, e)}
                    />

                    {item.banner && (
                      <div className="mb-4 flex justify-end">
                        <Button
                          className="text-sm"
                          variant="destructive"
                          onClick={() => handleDelete(item.banner!.id, itemId)}
                        >
                          Удалить
                        </Button>
                      </div>
                    )}

                    {/* Preview с точными размерами */}
                    <div className="mb-4">
                      <div
                        style={{
                          width: "100%",
                          maxWidth: `${config.width}px`,
                          aspectRatio: `${config.width} / ${config.height}`,
                          position: "relative",
                        }}
                        className="group cursor-pointer rounded border border-gray-300 bg-gray-50"
                        onClick={() => triggerFileInput(itemId)}
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
                          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                          type="text"
                          value={bannerNames[itemId] || ""}
                          onChange={(e) =>
                            setBannerNames((prev) => ({
                              ...prev,
                              [itemId]: e.target.value,
                            }))
                          }
                          placeholder="Например: Google Browser"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                          URL для перехода
                        </label>
                        <input
                          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                          type="url"
                          value={bannerUrls[itemId] || ""}
                          onChange={(e) =>
                            setBannerUrls((prev) => ({
                              ...prev,
                              [itemId]: e.target.value,
                            }))
                          }
                          placeholder="https://example.com"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 sm:flex-row">
                      <Button
                        className="flex-1"
                        disabled={isUploading}
                        variant="success"
                        onClick={() => triggerFileInput(itemId)}
                      >
                        {item.banner ? "Изменить изображение" : "Выбрать файл"}
                      </Button>
                      {previewImage && (
                        <Button
                          className="flex-1"
                          disabled={isUploading}
                          onClick={() => handleUpload(itemId, config.place, item.banner?.id)}
                        >
                          {isUploading ? "Загрузка..." : "Загрузить"}
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};
