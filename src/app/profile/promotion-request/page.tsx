"use client";

import type { Product } from "@/types";
import { TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {  Input, Typography } from "@/components/ui";
import { Button } from "@/components/ui-lab/Button";
import { addPromotion, getCurrentUserProducts } from "@/lib/api";
import { useCurrentUser } from "@/lib/api/hooks/queries";
import { api } from "@/lib/api/instance";

import { ProductSelector } from "./_components";

interface Promotion {
  id: number;
  name: string;
  pricePerDay: number;
}

const PromotionPage = () => {
  const { data: currentUser } = useCurrentUser();
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Модальное окно активации продвижения
  const [showActivatePromotion, setShowActivatePromotion] = useState(false);
  const [userProducts, setUserProducts] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null,
  );
  const [selectedPromotionId, setSelectedPromotionId] = useState<number | null>(
    null,
  );
  const [days, setDays] = useState("");
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);

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

  const closeModals = () => {
    setShowActivatePromotion(false);
    setSelectedProductId(null);
    setSelectedPromotionId(null);
    setDays("");
    setUserProducts([]);
  };

  const openActivatePromotionModal = async (promotionId: number) => {
    if (!currentUser) {
      toast.error("Не удалось получить данные пользователя");
      return;
    }

    try {
      setIsLoadingProducts(true);
      setSelectedPromotionId(promotionId);
      setShowActivatePromotion(true);

      // Получаем товары пользователя
      const products = await getCurrentUserProducts(currentUser.id);
      setUserProducts(products || []);
    } catch (error: any) {
      console.error("Ошибка загрузки товаров:", error);
      toast.error("Не удалось загрузить список товаров");
      setShowActivatePromotion(false);
    } finally {
      setIsLoadingProducts(false);
    }
  };

  const handleActivatePromotion = async () => {
    if (!selectedProductId || !selectedPromotionId || !days.trim()) {
      toast.error("Заполните все поля");
      return;
    }

    const daysNum = Number.parseInt(days, 10);
    if (isNaN(daysNum) || daysNum < 1) {
      toast.error("Введите корректное количество дней (минимум 1)");
      return;
    }

    try {
      setIsSubmitting(true);
      await addPromotion({
        productId: selectedProductId,
        promotionId: selectedPromotionId,
        days: daysNum,
      });
      toast.success("Продвижение успешно активировано");
      closeModals();
    } catch (error: any) {
      console.error("Ошибка активации продвижения:", error);
      const errorMessage =
        error.response?.data?.message || "Не удалось активировать продвижение";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
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
        {/* Заголовок */}
        <div>
          <Typography className="text-3xl font-bold">
            Продвижение товаров
          </Typography>
          <Typography className="mt-2 text-gray-600">
            Выберите тип продвижения и товар для активации
          </Typography>
        </div>

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
                    <div className="mb-4 flex items-baseline gap-1">
                      <span className="text-3xl font-bold text-blue-600">
                        {promotion.pricePerDay}
                      </span>
                      <span className="text-sm font-medium text-gray-600">
                        ₽ / день
                      </span>
                    </div>
                    <Button
                      className="w-full bg-blue-500 hover:bg-blue-600"
                      onClick={() => openActivatePromotionModal(promotion.id)}
                    >
                      Выбрать товар
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Модальное окно активации продвижения */}
      {showActivatePromotion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg bg-white p-6 shadow-lg">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-semibold">
                  Активировать продвижение товара
                </h3>
                {selectedPromotionId && (
                  <p className="mt-1 text-sm text-gray-600">
                    Тариф:{" "}
                    <span className="font-semibold text-blue-600">
                      {
                        promotions.find((p) => p.id === selectedPromotionId)
                          ?.name
                      }
                    </span>
                    {" — "}
                    {
                      promotions.find((p) => p.id === selectedPromotionId)
                        ?.pricePerDay
                    }{" "}
                    ₽ / день
                  </p>
                )}
              </div>
              <button
                className="rounded p-1 hover:bg-gray-100"
                type="button"
                onClick={closeModals}
              >
                ✕
              </button>
            </div>

            {isLoadingProducts ? (
              <div className="flex min-h-[200px] items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-500" />
              </div>
            ) : (
              <div className="space-y-6">
                {/* Шаг 1: Выбор товара */}
                <div>
                  <label className="mb-3 block text-base font-semibold text-gray-700">
                    1. Выберите товар для продвижения
                  </label>
                  <ProductSelector
                    products={userProducts}
                    selectedProductId={selectedProductId}
                    onSelectProduct={setSelectedProductId}
                  />
                </div>

                {/* Шаг 2: Количество дней */}
                <div>
                  <label className="mb-3 block text-base font-semibold text-gray-700">
                    2. Укажите количество дней
                  </label>
                  <Input
                    min="1"
                    type="number"
                    value={days}
                    onChange={(e) => setDays(e.target.value)}
                    placeholder="Например: 7"
                  />
                  {selectedPromotionId && days && (
                    <p className="mt-2 text-sm text-gray-600">
                      Итого:{" "}
                      <span className="font-semibold text-blue-600">
                        {(
                          (promotions.find((p) => p.id === selectedPromotionId)
                            ?.pricePerDay || 0) * Number.parseInt(days, 10)
                        ).toFixed(0)}{" "}
                        ₽
                      </span>
                    </p>
                  )}
                </div>
              </div>
            )}

            <div className="mt-6 flex justify-end gap-2 border-t pt-4">
              <Button variant="destructive" onClick={closeModals}>
                Отмена
              </Button>
              <Button
                className="bg-green-500 hover:bg-green-600"
                disabled={
                  isSubmitting ||
                  !selectedProductId ||
                  !selectedPromotionId ||
                  !days
                }
                onClick={handleActivatePromotion}
              >
                {isSubmitting ? "Активация..." : "Активировать"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PromotionPage;
