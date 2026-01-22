"use client";

import { Image as ImageIcon, Send, Upload, X } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { toast } from "sonner";

import { Button, Input, Typography } from "@/components/ui";

const BannerRequestPage = () => {
  const [bannerName, setBannerName] = useState("");
  const [targetUrl, setTargetUrl] = useState("");
  const [bannerPlace, setBannerPlace] = useState("");
  const [days, setDays] = useState("");
  const [comment, setComment] = useState("");
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const bannerPlaces = [
    {
      id: "product_feed",
      name: "Лента товаров",
      size: "320×400",
      price: 500,
    },
    {
      id: "profile",
      name: "Профиль",
      size: "660×400",
      price: 800,
    },
    {
      id: "chats",
      name: "Чаты",
      size: "1280×400",
      price: 1200,
    },
    {
      id: "favorites",
      name: "Избранное",
      size: "1280×200",
      price: 1000,
    },
  ];

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

    if (
      !bannerName.trim() ||
      !targetUrl.trim() ||
      !bannerPlace ||
      !days ||
      !previewImage
    ) {
      toast.error("Заполните все обязательные поля и загрузите изображение");
      return;
    }

    setIsSubmitting(true);

    // Имитация отправки
    setTimeout(() => {
      toast.success("Заявка на размещение баннера успешно отправлена!");
      setBannerName("");
      setTargetUrl("");
      setBannerPlace("");
      setDays("");
      setComment("");
      clearImage();
      setIsSubmitting(false);
    }, 1000);
  };

  const selectedPlace = bannerPlaces.find((p) => p.id === bannerPlace);
  const totalPrice = selectedPlace
    ? selectedPlace.price * Number(days || 0)
    : 0;

  return (
    <div className="w-full space-y-6">
      <div>
        <Typography className="text-2xl font-bold sm:text-3xl">
          Заявка на размещение баннера
        </Typography>
        <Typography className="mt-2 text-gray-600">
          Разместите рекламный баннер на нашей платформе. Заявка будет
          рассмотрена в течение 24 часов.
        </Typography>
      </div>

      <div className="rounded-lg bg-white p-4 shadow-sm sm:p-6">
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Информация о баннере */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b pb-3">
              <ImageIcon className="h-5 w-5 text-purple-500" />
              <Typography className="text-lg font-semibold">
                Информация о баннере
              </Typography>
            </div>

            <div>
              <label
                className="mb-2 block text-sm font-medium text-gray-700"
                htmlFor="bannerName"
              >
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
              <label
                className="mb-2 block text-sm font-medium text-gray-700"
                htmlFor="targetUrl"
              >
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
                  className="flex w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 p-8 transition-colors hover:border-blue-400 hover:bg-blue-50"
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-8 w-8 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    Нажмите для загрузки изображения
                  </span>
                  <span className="text-xs text-gray-400">PNG, JPG до 5MB</span>
                </button>
              )}
            </div>
          </div>

          {/* Место размещения */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b pb-3">
              <ImageIcon className="h-5 w-5 text-green-500" />
              <Typography className="text-lg font-semibold">
                Место и срок размещения
              </Typography>
            </div>

            <div>
              <span className="mb-2 block text-sm font-medium text-gray-700">
                Место размещения <span className="text-red-500">*</span>
              </span>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {bannerPlaces.map((place) => (
                  <button
                    key={place.id}
                    className={`rounded-lg border-2 p-4 text-left transition-all ${
                      bannerPlace === place.id
                        ? "border-purple-500 bg-purple-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    type="button"
                    onClick={() => setBannerPlace(place.id)}
                  >
                    <p className="font-semibold text-gray-900">{place.name}</p>
                    <p className="text-xs text-gray-500">{place.size} px</p>
                    <p className="mt-1 text-sm text-purple-600">
                      {place.price} ₽/день
                    </p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label
                className="mb-2 block text-sm font-medium text-gray-700"
                htmlFor="bannerDays"
              >
                Количество дней <span className="text-red-500">*</span>
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
                  <span className="text-gray-700">Итого к оплате:</span>
                  <span className="text-2xl font-bold text-purple-600">
                    {totalPrice} ₽
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Комментарий */}
          <div>
            <label
              className="mb-2 block text-sm font-medium text-gray-700"
              htmlFor="bannerComment"
            >
              Комментарий к заявке
            </label>
            <textarea
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none"
              id="bannerComment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Дополнительная информация..."
              rows={4}
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

      {/* Информационный блок */}
      <div className="rounded-lg border border-purple-200 bg-purple-50 p-4">
        <Typography className="font-semibold text-purple-800">
          Требования к баннерам
        </Typography>
        <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-purple-700">
          <li>Изображение должно соответствовать выбранному размеру</li>
          <li>Формат: PNG или JPG, не более 5MB</li>
          <li>Контент должен соответствовать правилам платформы</li>
          <li>После модерации баннер будет размещен автоматически</li>
        </ul>
      </div>
    </div>
  );
};

export default BannerRequestPage;
