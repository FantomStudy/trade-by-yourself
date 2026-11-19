"use client";

import type { Banner, BannerPlace } from "@/api/types/banner";

import { ChevronLeft, ChevronRight, ImagePlus, Trash2, Upload } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { createBanner, deleteBanner, getBanners, updateBanner } from "@/api/requests/banner";
import { Typography } from "@/components/ui";
import { Button } from "@/components/ui/Button";

interface BannerConfig {
  description: string;
  height: number;
  place: BannerPlace;
  width: number;
  cardWidth: number;
}

const BANNER_CONFIGS: BannerConfig[] = [
  {
    place: "PRODUCT_FEED",
    width: 320,
    height: 400,
    description: "Баннер в ленте карточек",
    cardWidth: 320,
  },
  {
    place: "PROFILE",
    width: 660,
    height: 400,
    description: "Большой баннер в ленте карточек",
    cardWidth: 380,
  },
  {
    place: "CHATS",
    width: 1280,
    height: 400,
    description: "Баннер среди чатов",
    cardWidth: 440,
  },
  {
    place: "FAVORITES",
    width: 1280,
    height: 200,
    description: "Баннер под хедером на главной странице",
    cardWidth: 460,
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
  const rowRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    loadBanners();
  }, []);

  const loadBanners = async () => {
    try {
      setLoading(true);
      const data = await getBanners();
      setBanners(Array.isArray(data) ? data : []);

      // Заполняем поля name и navigateToUrl из существующих баннеров
      const names: Record<string, string> = {};
      const urls: Record<string, string> = {};

      if (Array.isArray(data)) {
        data.forEach((banner) => {
          names[banner.id.toString()] = banner.name;
          urls[banner.id.toString()] = banner.navigateToUrl;
        });
      }

      setBannerNames(names);
      setBannerUrls(urls);
    } catch (error) {
      console.error("Ошибка загрузки баннеров:", error);
      toast.error("Не удалось загрузить список баннеров");
    } finally {
      setLoading(false);
    }
  };

  const scrollRow = (place: string, direction: "left" | "right") => {
    const el = rowRefs.current[place];
    if (el) {
      const scrollAmount = direction === "left" ? -400 : 400;
      el.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const handleImageSelect = (itemId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    setPreviewImages((prev) => ({ ...prev, [itemId]: imageUrl }));
  };

  const handleUpload = async (itemId: string, place: BannerPlace, bannerId?: number) => {
    const fileInput = fileInputRefs.current[itemId];
    const file = fileInput?.files?.[0];

    if (!file && !bannerId) {
      toast.error("Выберите изображение для баннера");
      return;
    }

    const name = bannerNames[itemId]?.trim();
    const navigateToUrl = bannerUrls[itemId]?.trim();

    if (!name) {
      toast.error("Введите название баннера");
      return;
    }

    if (!navigateToUrl) {
      toast.error("Введите URL для перехода");
      return;
    }

    try {
      new URL(navigateToUrl);
    } catch {
      toast.error("Введите корректный URL (например, https://example.com)");
      return;
    }

    const config = BANNER_CONFIGS.find((c) => c.place === place);
    if (!config) return;

    try {
      setUploadingId(itemId);

      if (bannerId) {
        // Обновляем существующий баннер
        await updateBanner(bannerId, {
          ...(file ? { image: file } : {}),
          name,
          navigateToUrl,
        });
        toast.success("Баннер успешно обновлен!");
      } else {
        // Создаем новый баннер
        if (!file) {
          toast.error("Выберите изображение для нового баннера");
          return;
        }
        await createBanner({
          image: file,
          place,
          name,
          navigateToUrl,
        });
        toast.success("Баннер успешно создан!");
      }

      await loadBanners();

      setPreviewImages((prev) => ({ ...prev, [itemId]: null }));
      if (fileInput) fileInput.value = "";
    } catch (error) {
      console.error("Ошибка сохранения баннера:", error);
      toast.error("Ошибка при сохранении баннера");
    } finally {
      setUploadingId(null);
    }
  };

  const handleDelete = async (bannerId: number, itemId: string) => {
    if (!confirm("Вы уверены, что хотите удалить этот баннер?")) return;

    try {
      await deleteBanner(bannerId);
      await loadBanners();

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

      toast.success("Баннер успешно удален!");
    } catch (error) {
      console.error("Ошибка удаления баннера:", error);
      toast.error("Ошибка при удалении баннера");
    }
  };

  const triggerFileInput = (itemId: string) => {
    fileInputRefs.current[itemId]?.click();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Typography>Загрузка баннеров...</Typography>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <Typography className="text-xl font-semibold">Управление баннерами</Typography>
        <Typography className="mt-1 text-sm text-gray-500">
          Баннеры сгруппированы по местам размещения. Листайте вправо, чтобы просмотреть все активные баннеры в строке.
        </Typography>
      </div>

      <div className="space-y-8">
        {BANNER_CONFIGS.map((config) => {
          const existingBanners = banners.filter((b) => b.place === config.place);

          // Список карточек: активные баннеры + слот добавления нового баннера
          const items = [
            ...existingBanners.map((banner) => ({
              id: banner.id.toString(),
              banner,
            })),
            { id: `new-${config.place}`, banner: null },
          ];

          return (
            <div
              key={config.place}
              className="rounded-xl border border-gray-200 bg-gray-50/50 p-4 sm:p-5"
            >
              {/* Заголовок строки и кнопки прокрутки */}
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="h-6 w-1 rounded-full bg-blue-600" />
                  <div>
                    <Typography className="text-base font-semibold sm:text-lg">
                      {config.width} × {config.height} — {config.description}
                    </Typography>
                  </div>
                  <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-800">
                    Активных: {existingBanners.length}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="mr-2 hidden text-xs text-gray-400 sm:inline">Листать</span>
                  <button
                    type="button"
                    onClick={() => scrollRow(config.place, "left")}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-700 shadow-sm transition hover:bg-gray-100 active:scale-95"
                    title="Листать влево"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollRow(config.place, "right")}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-700 shadow-sm transition hover:bg-gray-100 active:scale-95"
                    title="Листать вправо"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Горизонтальный скролл-контейнер для баннеров */}
              <div
                ref={(el) => {
                  rowRefs.current[config.place] = el;
                }}
                className="flex flex-row items-stretch gap-4 overflow-x-auto pb-3 pt-1 scroll-smooth"
                style={{
                  scrollbarWidth: "thin",
                }}
              >
                {items.map((item, index) => {
                  const itemId = item.id;
                  const previewImage = previewImages[itemId];
                  const currentImage = previewImage || item.banner?.photoUrl;
                  const isUploading = uploadingId === itemId;
                  const isNew = !item.banner;

                  return (
                    <div
                      key={itemId}
                      style={{
                        width: `${config.cardWidth}px`,
                        minWidth: `${config.cardWidth}px`,
                      }}
                      className={`flex flex-col justify-between shrink-0 rounded-xl p-4 transition-shadow ${
                        isNew
                          ? "border-2 border-dashed border-blue-300 bg-blue-50/30 hover:border-blue-400"
                          : "border border-gray-200 bg-white shadow-sm hover:shadow"
                      }`}
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

                      {/* Верхняя плашка карточки */}
                      <div className="mb-3 flex items-center justify-between">
                        <span
                          className={`rounded px-2 py-0.5 text-xs font-semibold ${
                            isNew
                              ? "bg-blue-600 text-white"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {isNew ? "+ Добавить баннер" : `Баннер #${item.banner!.id}`}
                        </span>

                        {!isNew && (
                          <button
                            type="button"
                            className="flex items-center gap-1 text-xs text-red-600 transition hover:text-red-800"
                            onClick={() => handleDelete(item.banner!.id, itemId)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            <span>Удалить</span>
                          </button>
                        )}
                      </div>

                      {/* Превью баннера с сохранением пропорций */}
                      <div className="mb-3">
                        <div
                          style={{
                            width: "100%",
                            aspectRatio: `${config.width} / ${config.height}`,
                            position: "relative",
                          }}
                          className={`group cursor-pointer overflow-hidden rounded-lg border ${
                            isNew ? "border-dashed border-blue-300 bg-white" : "border-gray-200 bg-gray-50"
                          }`}
                          onClick={() => triggerFileInput(itemId)}
                        >
                          {currentImage ? (
                            <>
                              <Image
                                fill
                                alt={item.banner?.name || `Баннер ${config.width}x${config.height}`}
                                className="object-cover"
                                src={currentImage}
                              />
                              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                                <Upload className="mb-1 h-5 w-5 text-white" />
                                <Typography className="text-xs font-medium text-white">
                                  {previewImage ? "Выбрать другое" : "Заменить изображение"}
                                </Typography>
                              </div>
                            </>
                          ) : (
                            <div className="flex h-full flex-col items-center justify-center gap-1.5 p-3 text-center">
                              <ImagePlus className="h-8 w-8 text-blue-500" />
                              <Typography className="text-xs font-medium text-gray-700">
                                {config.width} × {config.height}
                              </Typography>
                              <Typography className="text-[11px] text-gray-500">
                                Нажмите для выбора файла
                              </Typography>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Поля названия и ссылки */}
                      <div className="mb-3 space-y-2">
                        <div>
                          <label className="mb-1 block text-xs font-medium text-gray-700">
                            Название баннера
                          </label>
                          <input
                            className="w-full rounded-md border border-gray-300 bg-white px-2.5 py-1.5 text-xs text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            type="text"
                            value={bannerNames[itemId] || ""}
                            onChange={(e) =>
                              setBannerNames((prev) => ({
                                ...prev,
                                [itemId]: e.target.value,
                              }))
                            }
                            placeholder="Название для админки"
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-xs font-medium text-gray-700">
                            URL для перехода
                          </label>
                          <input
                            className="w-full rounded-md border border-gray-300 bg-white px-2.5 py-1.5 text-xs text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
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

                      {/* Кнопки действий */}
                      <div className="mt-auto flex flex-col gap-1.5">
                        <Button
                          size="sm"
                          disabled={isUploading}
                          variant={isNew ? "outline" : "outline"}
                          className="w-full text-xs"
                          onClick={() => triggerFileInput(itemId)}
                        >
                          {currentImage ? "Сменить фото" : "Выбрать фото"}
                        </Button>
                        <Button
                          size="sm"
                          disabled={isUploading || (!previewImage && isNew)}
                          variant={isNew ? "default" : "success"}
                          className="w-full text-xs"
                          onClick={() => handleUpload(itemId, config.place, item.banner?.id)}
                        >
                          {isUploading
                            ? "Сохранение..."
                            : isNew
                              ? "Загрузить баннер"
                              : previewImage
                                ? "Сохранить с новым фото"
                                : "Сохранить изменения"}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
