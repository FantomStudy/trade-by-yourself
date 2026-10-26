"use client";

import {
  CheckCircle2,
  Clock,
  Edit2,
  Image as ImageIcon,
  Power,
  PowerOff,
  Send,
  Trash2,
  Upload,
  X,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { api } from "@/lib/api/instance";
import { getApiErrorMessage } from "@/lib/api/get-api-error-message";
import { Input, Typography } from "@/components/ui";
import { Button } from "@/components/ui/Button";

import {
  BANNER_PLACE_LABELS,
  BannerPreviewMockup,
} from "./_components/banner-preview-mockup";
import {
  EditBannerDialog,
  type UserBannerItem,
} from "./_components/edit-banner-dialog";

const BannerRequestPage = () => {
  const [bannerName, setBannerName] = useState("");
  const [targetUrl, setTargetUrl] = useState("");
  const [bannerPlace, setBannerPlace] = useState("PRODUCT_FEED");
  const [days, setDays] = useState("");
  const [comment, setComment] = useState("");
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [myBanners, setMyBanners] = useState<UserBannerItem[]>([]);
  const [isLoadingBanners, setIsLoadingBanners] = useState(false);
  const [editingBanner, setEditingBanner] = useState<UserBannerItem | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [actionBannerId, setActionBannerId] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const bannerPlaces = [
    {
      id: "PRODUCT_FEED",
      name: "Лента товаров",
      size: "320×400",
      price: 500,
    },
    {
      id: "PROFILE",
      name: "Профиль",
      size: "660×400",
      price: 800,
    },
    {
      id: "CHATS",
      name: "Чаты",
      size: "1280×400",
      price: 1200,
    },
    {
      id: "FAVORITES",
      name: "Избранное",
      size: "1280×200",
      price: 1000,
    },
  ];

  const loadMyBanners = async () => {
    try {
      setIsLoadingBanners(true);
      const res = await api<UserBannerItem[]>("/banner/my-stats/all");
      setMyBanners(res || []);
    } catch (err) {
      console.warn("Ошибка загрузки баннеров:", err);
    } finally {
      setIsLoadingBanners(false);
    }
  };

  const handleToggleBanner = async (banner: UserBannerItem) => {
    try {
      setActionBannerId(banner.id);
      await api(`/banner/${banner.id}/toggle`, {
        method: "PATCH",
      });
      if (banner.moderateState === "DENIDED") {
        toast.success("Баннер включен и отправлен на модерацию!");
      } else {
        toast.success("Баннер отключен");
      }
      await loadMyBanners();
    } catch (err) {
      const msg = getApiErrorMessage(err, "Не удалось изменить статус баннера");
      toast.error(msg);
    } finally {
      setActionBannerId(null);
    }
  };

  const handleDeleteBanner = async (bannerId: number) => {
    if (!confirm("Вы уверены, что хотите удалить этот баннер?")) return;

    try {
      setActionBannerId(bannerId);
      await api(`/banner/${bannerId}`, {
        method: "DELETE",
      });
      toast.success("Баннер удален");
      await loadMyBanners();
    } catch (err) {
      const msg = getApiErrorMessage(err, "Не удалось удалить баннер");
      toast.error(msg);
    } finally {
      setActionBannerId(null);
    }
  };

  useEffect(() => {
    loadMyBanners();
  }, []);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    setPreviewImage(imageUrl);
  };

  const clearImage = () => {
    setPreviewImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const file = fileInputRef.current?.files?.[0];
    if (!bannerName.trim() || !targetUrl.trim() || !bannerPlace || !file) {
      toast.error("Заполните все обязательные поля и загрузите изображение");
      return;
    }

    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append("name", bannerName.trim());
      formData.append("navigateToUrl", targetUrl.trim());
      formData.append("place", bannerPlace);
      formData.append("image", file);

      await api("/banner", {
        method: "POST",
        body: formData,
      });

      toast.success("Заявка на баннер успешно отправлена и ожидает модерации!");
      setBannerName("");
      setTargetUrl("");
      setBannerPlace("");
      setDays("");
      setComment("");
      clearImage();
      await loadMyBanners();
    } catch (error) {
      const msg = getApiErrorMessage(error, "Не удалось отправить заявку на баннер");
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedPlace = bannerPlaces.find((p) => p.id === bannerPlace);
  const totalPrice = selectedPlace ? selectedPlace.price * Number(days || 0) : 0;

  const renderStatusBadge = (state?: string) => {
    switch (state) {
      case "APPROVED":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-700">
            <CheckCircle2 className="h-3 w-3" /> Одобрен
          </span>
        );
      case "DENIDED":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-700">
            <XCircle className="h-3 w-3" /> Отклонён
          </span>
        );
      case "MODERATE":
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-semibold text-yellow-800">
            <Clock className="h-3 w-3" /> На модерации
          </span>
        );
    }
  };

  return (
    <div className="w-full space-y-8">
      <div>
        <Typography className="text-2xl font-bold sm:text-3xl">
          Заявка на размещение баннера
        </Typography>
        <Typography className="mt-2 text-gray-600">
          Разместите рекламный баннер на нашей платформе. Заявка отправляется администратору и проходит премодерацию.
        </Typography>
      </div>

      <div className="rounded-lg bg-white p-4 shadow-sm sm:p-6">
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Информация о баннере */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b pb-3">
              <ImageIcon className="h-5 w-5 text-purple-500" />
              <Typography className="text-lg font-semibold">Информация о баннере</Typography>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700" htmlFor="bannerName">
                Название баннера <span className="text-red-500">*</span>
              </label>
              <Input
                id="bannerName"
                value={bannerName}
                onChange={(e) => setBannerName(e.target.value)}
                placeholder="Например: Акция на товары"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700" htmlFor="targetUrl">
                URL для перехода <span className="text-red-500">*</span>
              </label>
              <Input
                id="targetUrl"
                type="url"
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                placeholder="https://example.com"
              />
            </div>

            {/* Загрузка изображения */}
            <div>
              <span className="mb-2 block text-sm font-medium text-gray-700">
                Изображение баннера <span className="text-red-500">*</span>
              </span>
              <input
                ref={fileInputRef}
                accept="image/*"
                className="hidden"
                type="file"
                onChange={handleImageSelect}
              />
              {previewImage ? (
                <div className="relative">
                  <div className="relative h-48 w-full overflow-hidden rounded-lg border border-gray-300">
                    <Image
                      fill
                      alt="Превью баннера"
                      className="object-contain"
                      src={previewImage}
                    />
                  </div>
                  <button
                    className="absolute top-2 right-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                    type="button"
                    onClick={clearImage}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <button
                  className="flex h-36 w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 transition-colors hover:border-purple-500"
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-8 w-8 text-gray-400" />
                  <span className="mt-2 text-sm text-gray-600">Нажмите для загрузки баннера</span>
                  <span className="mt-1 text-xs text-gray-400">PNG, JPG до 5MB</span>
                </button>
              )}
            </div>
          </div>

          {/* Настройки размещения */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b pb-3">
              <Typography className="text-lg font-semibold">Настройки размещения</Typography>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Место размещения <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {bannerPlaces.map((place) => (
                  <button
                    key={place.id}
                    className={`rounded-lg border-2 p-3 text-left transition-colors ${
                      bannerPlace === place.id
                        ? "border-purple-500 bg-purple-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    type="button"
                    onClick={() => setBannerPlace(place.id)}
                  >
                    <p className="font-semibold text-gray-900">{place.name}</p>
                    <p className="text-xs text-gray-500">{place.size} px</p>
                    <p className="mt-1 text-sm text-purple-600">{place.price} ₽/день</p>
                  </button>
                ))}
              </div>

              {/* Интерактивный пример (мокап) того, как баннер будет выглядеть на платформе */}
              <BannerPreviewMockup
                place={bannerPlace || "PRODUCT_FEED"}
                imageUrl={previewImage}
                bannerName={bannerName}
                targetUrl={targetUrl}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700" htmlFor="bannerDays">
                Количество дней
              </label>
              <Input
                id="bannerDays"
                min="1"
                type="number"
                value={days}
                onChange={(e) => setDays(e.target.value)}
                placeholder="Например: 7"
              />
            </div>

            {totalPrice > 0 && (
              <div className="rounded-lg bg-purple-50 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Итого:</span>
                  <span className="text-2xl font-bold text-purple-600">{totalPrice} ₽</span>
                </div>
              </div>
            )}
          </div>

          {/* Комментарий */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700" htmlFor="bannerComment">
              Комментарий к заявке
            </label>
            <textarea
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none"
              id="bannerComment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Дополнительная информация для администратора..."
              rows={3}
            />
          </div>

          {/* Кнопка отправки */}
          <Button
            className="w-full bg-purple-500 hover:bg-purple-600 sm:w-auto"
            disabled={isSubmitting}
            type="submit"
          >
            <Send className="mr-2 h-4 w-4" />
            {isSubmitting ? "Отправка..." : "Отправить заявку"}
          </Button>
        </form>
      </div>

      {/* Список ранее отправленных баннеров пользователя */}
      <div className="rounded-lg bg-white p-4 shadow-sm sm:p-6 space-y-4">
        <Typography className="text-xl font-bold">Мои баннеры и заявки</Typography>
        {isLoadingBanners ? (
          <p className="text-sm text-gray-500">Загрузка ваших баннеров...</p>
        ) : myBanners.length === 0 ? (
          <p className="text-sm text-gray-500">У вас пока нет отправленных заявок на баннеры.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {myBanners.map((banner) => (
              <div
                key={banner.id}
                className="overflow-hidden rounded-lg border border-gray-200 bg-gray-50 p-3 space-y-2"
              >
                {banner.photoUrl && (
                  <div className="relative h-32 w-full overflow-hidden rounded bg-white">
                    <Image
                      src={banner.photoUrl}
                      alt={banner.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-gray-900 truncate">{banner.name}</h4>
                  {renderStatusBadge(banner.moderateState)}
                </div>
                <p className="text-xs text-gray-600 font-medium">
                  Место: <span className="text-purple-700">{BANNER_PLACE_LABELS[banner.place] || banner.place}</span>
                </p>
                {banner.navigateToUrl && (
                  <p className="text-xs text-blue-600 truncate">{banner.navigateToUrl}</p>
                )}
                <div className="text-xs text-gray-500 flex justify-between border-t pt-1">
                  <span>Просмотры: {banner.totalViews || 0}</span>
                  <span>{new Date(banner.createdAt).toLocaleDateString("ru-RU")}</span>
                </div>

                {/* Действия с баннером: отключение, редактирование, удаление */}
                <div className="flex items-center gap-1.5 border-t border-gray-200 pt-2">
                  <button
                    type="button"
                    disabled={actionBannerId === banner.id}
                    onClick={() => handleToggleBanner(banner)}
                    className={`flex flex-1 items-center justify-center gap-1 rounded-md px-2 py-1 text-xs font-medium transition-colors ${
                      banner.moderateState === "DENIDED"
                        ? "bg-green-50 text-green-700 border border-green-200 hover:bg-green-100"
                        : "bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100"
                    }`}
                  >
                    {banner.moderateState === "DENIDED" ? (
                      <>
                        <Power className="h-3 w-3" /> Включить
                      </>
                    ) : (
                      <>
                        <PowerOff className="h-3 w-3" /> Отключить
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setEditingBanner(banner);
                      setIsEditDialogOpen(true);
                    }}
                    className="flex flex-1 items-center justify-center gap-1 rounded-md border border-blue-200 bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 transition-colors hover:bg-blue-100"
                  >
                    <Edit2 className="h-3 w-3" /> Изменить
                  </button>

                  <button
                    type="button"
                    disabled={actionBannerId === banner.id}
                    onClick={() => handleDeleteBanner(banner.id)}
                    className="flex h-7 w-7 items-center justify-center rounded-md border border-red-200 bg-red-50 text-red-600 transition-colors hover:bg-red-100"
                    title="Удалить баннер"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Модальное окно редактирования баннера пользователем */}
      <EditBannerDialog
        banner={editingBanner}
        isOpen={isEditDialogOpen}
        onClose={() => {
          setIsEditDialogOpen(false);
          setEditingBanner(null);
        }}
        onSuccess={loadMyBanners}
      />

      {/* Информационный блок */}
      <div className="rounded-lg border border-purple-200 bg-purple-50 p-4">
        <Typography className="font-semibold text-purple-800">Требования к баннерам</Typography>
        <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-purple-700">
          <li>Изображение должно соответствовать выбранному размеру</li>
          <li>Формат: PNG или JPG, не более 5MB</li>
          <li>Контент должен соответствовать правилам платформы</li>
          <li>После одобрения модератором баннер будет размещен автоматически</li>
        </ul>
      </div>
    </div>
  );
};

export default BannerRequestPage;
