"use client";

import { Plus, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button, Input, Typography } from "@/components/ui";
import { api } from "@/lib/api/instance";

interface Promotion {
  id: number;
  name: string;
  pricePerDay: number;
}

const PromotionPage = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Модальное окно
  const [showAddPromotion, setShowAddPromotion] = useState(false);
  const [promotionName, setPromotionName] = useState("");
  const [pricePerDay, setPricePerDay] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const promotionsData = await api<Promotion[]>(
        "/promotion/all-promotions",
      );
      setPromotions(promotionsData);
    } catch (error) {
      console.error("Ошибка загрузки данных:", error);
      toast.error("Не удалось загрузить данные");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatePromotion = async () => {
    if (!promotionName.trim() || !pricePerDay.trim()) {
      toast.error("Заполните все поля");
      return;
    }

    const price = Number.parseFloat(pricePerDay);
    if (isNaN(price) || price < 0) {
      toast.error("Введите корректную цену");
      return;
    }

    try {
      setIsSubmitting(true);
      await api("/promotion/create", {
        method: "POST",
        body: { name: promotionName, pricePerDay: price },
      });
      toast.success("Тип продвижения создан");
      setShowAddPromotion(false);
      setPromotionName("");
      setPricePerDay("");
      loadData();
    } catch (error: any) {
      console.error("Ошибка создания:", error);
      const errorMessage =
        error.response?.data?.message || "Не удалось создать тип продвижения";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openAddPromotionModal = () => {
    setShowAddPromotion(true);
  };

  const closeModals = () => {
    setShowAddPromotion(false);
    setPromotionName("");
    setPricePerDay("");
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Typography className="text-3xl font-bold">
            Продвижение товаров
          </Typography>
          <Typography className="mt-2 text-gray-600">
            Управление типами продвижения товаров
          </Typography>
        </div>
        <div className="flex min-h-[400px] items-center justify-center rounded-lg bg-white p-8 shadow-sm">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-500" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6">
        {/* Типы продвижения */}
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-xl font-semibold">Типы продвижения</h3>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {promotions.length === 0 ? (
              <p className="col-span-full py-8 text-center text-gray-500">
                Нет типов продвижения
              </p>
            ) : (
              promotions.map((promotion) => (
                <div
                  key={promotion.id}
                  className="group relative overflow-hidden rounded-xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-6 shadow-sm transition-all hover:border-blue-300 hover:shadow-md"
                >
                  <div className="absolute top-0 right-0 h-24 w-24 translate-x-8 -translate-y-8 rounded-full bg-blue-100/50 blur-2xl transition-all group-hover:bg-blue-200/60" />
                  <div className="relative">
                    <div className="mb-4 flex items-center gap-3">
                      <div className="rounded-lg bg-blue-100 p-2.5">
                        <TrendingUp className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="h-8 w-px bg-gray-200" />
                      <div>
                        <p className="text-xs font-medium tracking-wide text-gray-500 uppercase">
                          Тариф
                        </p>
                      </div>
                    </div>
                    <h4 className="mb-3 text-2xl font-bold text-gray-900">
                      {promotion.name}
                    </h4>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold text-blue-600">
                        {promotion.pricePerDay}
                      </span>
                      <span className="text-sm font-medium text-gray-600">
                        ₽ / день
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Модальное окно создания типа продвижения */}
      {showAddPromotion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-semibold">Создать тип продвижения</h3>
              <button
                className="rounded p-1 hover:bg-gray-100"
                type="button"
                onClick={closeModals}
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Название
                </label>
                <Input
                  value={promotionName}
                  onChange={(e) => setPromotionName(e.target.value)}
                  placeholder="Например: Стандарт"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Цена за день (₽)
                </label>
                <Input
                  min="0"
                  step="0.01"
                  type="number"
                  value={pricePerDay}
                  onChange={(e) => setPricePerDay(e.target.value)}
                  placeholder="Например: 50"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <Button variant="destructive" onClick={closeModals}>
                Отмена
              </Button>
              <Button
                className="bg-blue-500 hover:bg-blue-600"
                disabled={isSubmitting}
                onClick={handleCreatePromotion}
              >
                {isSubmitting ? "Создание..." : "Создать"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PromotionPage;
