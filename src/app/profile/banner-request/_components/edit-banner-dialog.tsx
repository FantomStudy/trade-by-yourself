"use client";

import { Upload, X } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { api } from "@/lib/api/instance";
import { getApiErrorMessage } from "@/lib/api/get-api-error-message";
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Input } from "@/components/ui";

export interface UserBannerItem {
  id: number;
  name: string;
  place: string;
  photoUrl?: string;
  navigateToUrl?: string;
  moderateState?: "MODERATE" | "APPROVED" | "DENIDED" | string;
  totalViews?: number;
  createdAt: string;
}

interface EditBannerDialogProps {
  banner: UserBannerItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

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

export const EditBannerDialog: React.FC<EditBannerDialogProps> = ({
  banner,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [name, setName] = useState("");
  const [targetUrl, setTargetUrl] = useState("");
  const [place, setPlace] = useState("");
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [newFile, setNewFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (banner) {
      setName(banner.name || "");
      setTargetUrl(banner.navigateToUrl || "");
      setPlace(banner.place || "PRODUCT_FEED");
      setPreviewImage(banner.photoUrl || null);
      setNewFile(null);
    }
  }, [banner]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setNewFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewImage(objectUrl);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!banner) return;

    if (!name.trim()) {
      toast.error("Укажите название баннера");
      return;
    }
    if (!targetUrl.trim()) {
      toast.error("Укажите URL для перехода");
      return;
    }

    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("navigateToUrl", targetUrl.trim());
      formData.append("place", place);

      if (newFile) {
        formData.append("image", newFile);
      }

      await api(`/banner/${banner.id}`, {
        method: "PUT",
        body: formData,
      });

      toast.success("Баннер успешно обновлен и отправлен на модерацию!");
      onSuccess();
      onClose();
    } catch (err) {
      const msg = getApiErrorMessage(err, "Не удалось обновить баннер");
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg p-6 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Редактирование баннера</DialogTitle>
        </DialogHeader>

        <form className="space-y-4 pt-2" onSubmit={handleSave}>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="editBannerName">
              Название баннера *
            </label>
            <Input
              id="editBannerName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Например: Акция на медтехнику"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="editTargetUrl">
              URL для перехода *
            </label>
            <Input
              id="editTargetUrl"
              type="url"
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
              placeholder="https://example.com"
              required
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Место размещения *
            </label>
            <div className="grid grid-cols-2 gap-2">
              {bannerPlaces.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPlace(p.id)}
                  className={`rounded-lg border p-2 text-left transition-colors ${place === p.id
                      ? "border-purple-600 bg-purple-50 text-purple-900 ring-1 ring-purple-500"
                      : "border-gray-200 hover:border-gray-300 text-gray-800"
                    }`}
                >
                  <p className="text-xs font-bold">{p.name}</p>
                  <p className="text-[10px] text-gray-500">{p.size} px</p>
                  <p className="text-xs font-semibold text-purple-600">{p.price} ₽/день</p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <span className="mb-1.5 block text-sm font-medium text-gray-700">
              Изображение баннера
            </span>
            <input
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              type="file"
              onChange={handleFileChange}
            />

            {previewImage ? (
              <div className="relative rounded-lg border border-gray-300 p-2 bg-gray-50">
                <div className="relative h-36 w-full overflow-hidden rounded bg-white">
                  <Image
                    fill
                    alt="Превью баннера"
                    className="object-contain"
                    src={previewImage}
                  />
                </div>
                <div className="mt-2 flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="text-xs py-1 px-3"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Заменить изображение
                  </Button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                className="flex h-28 w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 hover:border-purple-500 text-gray-500"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-6 w-6 text-gray-400" />
                <span className="mt-1 text-xs">Загрузить новое изображение</span>
              </button>
            )}
          </div>

          <div className="rounded-lg bg-amber-50 p-3 text-xs text-amber-800 border border-amber-200">
            ℹ️ После сохранения изменений баннер будет отправлен на повторную модерацию администратору.
          </div>

          <div className="flex justify-end gap-3 pt-2 border-t">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Отмена
            </Button>
            <Button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Сохранение..." : "Сохранить изменения"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
