"use client";

import { Check, CheckCircle2, Clock, ExternalLink, X, XCircle } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { api } from "@/lib/api/instance";
import { getApiErrorMessage } from "@/lib/api/get-api-error-message";
import { Button } from "@/components/ui/Button";

interface BannerModerateUser {
  id: number;
  fullName: string;
  photo?: string | null;
}

interface BannerModerateItem {
  id: number;
  name: string;
  photoUrl: string;
  place: string;
  navigateToUrl: string;
  createdAt: string;
  user: BannerModerateUser;
}

export const BannerModerationList = () => {
  const [items, setItems] = useState<BannerModerateItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<number | null>(null);

  const loadQueue = async () => {
    try {
      setLoading(true);
      const data = await api<BannerModerateItem[]>("/banner/all-banners-to-moderate");
      setItems(data || []);
    } catch (err) {
      console.error("Ошибка загрузки очереди модерации баннеров:", err);
      toast.error("Не удалось загрузить очередь модерации баннеров");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQueue();
  }, []);

  const handleModerate = async (id: number, status: "APPROVED" | "DENIDED") => {
    try {
      setActionId(id);
      await api(`/banner/moderate/${id}`, {
        method: "PATCH",
        body: { status },
      });
      toast.success(status === "APPROVED" ? "Баннер одобрен и опубликован!" : "Баннер отклонён");
      await loadQueue();
    } catch (err) {
      const msg = getApiErrorMessage(err, "Ошибка при модерации баннера");
      toast.error(msg);
    } finally {
      setActionId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-500" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-gray-200 p-8 text-center">
        <Clock className="mx-auto h-10 w-10 text-gray-400 mb-2" />
        <h4 className="font-semibold text-gray-700">Очередь модерации пуста</h4>
        <p className="text-sm text-gray-500 mt-1">Все заявки на размещение баннеров проверены</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2 border-b">
        <span className="text-sm font-medium text-gray-600">
          Ожидают модерации: <strong className="text-gray-900">{items.length}</strong>
        </span>
        <Button size="sm" variant="outline" onClick={loadQueue}>
          Обновить
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex flex-col justify-between rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
          >
            <div className="space-y-3">
              {item.photoUrl && (
                <div className="relative h-44 w-full overflow-hidden rounded bg-gray-50">
                  <Image
                    src={item.photoUrl}
                    alt={item.name}
                    fill
                    className="object-contain"
                  />
                </div>
              )}

              <div>
                <h4 className="text-base font-bold text-gray-900">{item.name}</h4>
                <p className="text-xs text-gray-500 mt-0.5">
                  Место: <span className="font-medium text-gray-700">{item.place}</span>
                </p>
                {item.navigateToUrl && (
                  <a
                    href={item.navigateToUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1 inline-flex items-center gap-1 text-xs text-blue-600 hover:underline break-all"
                  >
                    <span>{item.navigateToUrl}</span>
                    <ExternalLink className="h-3 w-3 shrink-0" />
                  </a>
                )}
              </div>

              <div className="flex items-center justify-between rounded bg-gray-50 p-2 text-xs text-gray-600">
                <span>Автор: <strong>{item.user.fullName || `ID ${item.user.id}`}</strong></span>
                <span>{new Date(item.createdAt).toLocaleString("ru-RU")}</span>
              </div>
            </div>

            <div className="mt-4 flex gap-2 border-t pt-3">
              <Button
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                size="sm"
                disabled={actionId === item.id}
                onClick={() => handleModerate(item.id, "APPROVED")}
              >
                <Check className="mr-1 h-4 w-4" />
                Одобрить
              </Button>
              <Button
                className="flex-1"
                variant="destructive"
                size="sm"
                disabled={actionId === item.id}
                onClick={() => handleModerate(item.id, "DENIDED")}
              >
                <X className="mr-1 h-4 w-4" />
                Отклонить
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
