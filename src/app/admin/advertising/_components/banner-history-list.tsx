"use client";

import { Check, CheckCircle2, Clock, ExternalLink, History, X, XCircle } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { api } from "@/lib/api/instance";
import { getApiErrorMessage } from "@/lib/api/get-api-error-message";
import { Button } from "@/components/ui/Button";

interface BannerHistoryUser {
  id: number;
  fullName: string;
  photo?: string | null;
}

interface BannerHistoryItem {
  id: number;
  name: string;
  photoUrl: string;
  place: string;
  navigateToUrl: string;
  moderateState: "APPROVED" | "DENIDED" | "MODERATE";
  isHide: boolean;
  createdAt: string;
  updatedAt: string;
  user: BannerHistoryUser;
}

type HistoryFilter = "ALL" | "APPROVED" | "DENIDED" | "MODERATE";

const PLACE_LABELS: Record<string, string> = {
  PRODUCT_FEED: "Лента товаров (500 ₽)",
  PROFILE: "Профиль (800 ₽)",
  CHATS: "Чаты (1200 ₽)",
  FAVORITES: "Избранное (1000 ₽)",
};

const STATUS_BADGES: Record<string, { label: string; className: string }> = {
  APPROVED: { label: "Одобрен", className: "bg-emerald-100 text-emerald-800" },
  DENIDED: { label: "Отклонён", className: "bg-red-100 text-red-800" },
  MODERATE: { label: "На модерации", className: "bg-amber-100 text-amber-800" },
};

export const BannerHistoryList = () => {
  const [items, setItems] = useState<BannerHistoryItem[]>([]);
  const [filter, setFilter] = useState<HistoryFilter>("ALL");
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<number | null>(null);

  const loadHistory = useCallback(async (statusFilter: HistoryFilter) => {
    try {
      setLoading(true);
      const query = statusFilter === "ALL" ? undefined : { status: statusFilter };
      const data = await api<BannerHistoryItem[]>("/banner/all-banners-history", { query });
      setItems(data || []);
    } catch (err) {
      console.error("Ошибка загрузки истории баннеров:", err);
      toast.error("Не удалось загрузить историю баннеров");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadHistory(filter);
  }, [filter, loadHistory]);

  const handleModerate = async (id: number, status: "APPROVED" | "DENIDED") => {
    try {
      setActionId(id);
      await api(`/banner/moderate/${id}`, {
        method: "PUT",
        query: { status },
        body: JSON.stringify({ status }),
      });
      toast.success(status === "APPROVED" ? "Баннер одобрен" : "Баннер отклонён");
      await loadHistory(filter);
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Ошибка при изменении статуса баннера"));
    } finally {
      setActionId(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b">
        <div className="flex flex-wrap gap-1.5">
          {(
            [
              { value: "ALL", label: "Все" },
              { value: "APPROVED", label: "Одобренные" },
              { value: "DENIDED", label: "Отклонённые" },
              { value: "MODERATE", label: "На модерации" },
            ] as const
          ).map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setFilter(f.value)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                filter === f.value
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <Button size="sm" variant="outline" onClick={() => void loadHistory(filter)}>
          Обновить
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center p-8">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-500" />
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-200 p-8 text-center">
          <History className="mx-auto h-10 w-10 text-gray-400 mb-2" />
          <h4 className="font-semibold text-gray-700">История баннеров пуста</h4>
          <p className="text-sm text-gray-500 mt-1">По выбранному фильтру нет баннеров</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {items.map((item) => {
            const badge = STATUS_BADGES[item.moderateState] || {
              label: item.moderateState,
              className: "bg-gray-100 text-gray-800",
            };
            return (
              <div
                key={item.id}
                className="flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
              >
                <div className="space-y-3">
                  <div className="relative h-40 w-full overflow-hidden rounded-lg bg-gray-100 border">
                    <Image
                      src={item.photoUrl}
                      alt={item.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                    <span
                      className={`absolute top-2 right-2 rounded-full px-2.5 py-0.5 text-xs font-semibold shadow-sm ${badge.className}`}
                    >
                      {badge.label}
                    </span>
                  </div>

                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-semibold text-gray-900 line-clamp-1">{item.name}</h4>
                      <span className="shrink-0 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                        {PLACE_LABELS[item.place] || item.place}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      Автор: <span className="font-medium text-gray-700">{item.user.fullName}</span> (ID: {item.user.id})
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Создан: {new Date(item.createdAt).toLocaleString("ru-RU")}
                    </p>
                    <a
                      href={item.navigateToUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1.5 inline-flex items-center gap-1 text-xs text-blue-600 hover:underline break-all"
                    >
                      {item.navigateToUrl}
                      <ExternalLink className="h-3 w-3 shrink-0" />
                    </a>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2 pt-3 border-t border-gray-100">
                  {item.moderateState !== "APPROVED" && (
                    <Button
                      size="sm"
                      variant="success"
                      className="flex-1"
                      disabled={actionId === item.id}
                      onClick={() => void handleModerate(item.id, "APPROVED")}
                    >
                      <CheckCircle2 className="mr-1.5 h-4 w-4" />
                      Одобрить
                    </Button>
                  )}
                  {item.moderateState !== "DENIDED" && (
                    <Button
                      size="sm"
                      variant="destructive"
                      className="flex-1"
                      disabled={actionId === item.id}
                      onClick={() => void handleModerate(item.id, "DENIDED")}
                    >
                      <XCircle className="mr-1.5 h-4 w-4" />
                      Отклонить
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

