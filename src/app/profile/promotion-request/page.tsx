"use client";

import type { Product } from "@/types";
import { TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Input, Typography } from "@/components/ui";
import { Button } from "@/components/ui/Button";
import { addPromotion, getCurrentUserProducts } from "@/lib/api";
import { useCurrentUser, useUserInfo } from "@/lib/api/hooks/queries";
import { useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api/instance";

import { ProductSelector } from "./_components";

interface Promotion {
  id: number;
  name: string;
  pricePerDay: number;
}

const PromotionPage = () => {
  const queryClient = useQueryClient();
  const { data: currentUser } = useCurrentUser();
  const { data: userInfo } = useUserInfo(currentUser?.id);

  const mainBalance = userInfo?.balance ?? currentUser?.balance ?? 0;
  const bonusBalance = userInfo?.bonusBalance ?? currentUser?.bonusBalance ?? 0;
  const totalAvailable = mainBalance + bonusBalance;
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Модальное окно активации продвижения
  const [showActivatePromotion, setShowActivatePromotion] = useState(false);
  const [userProducts, setUserProducts] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [selectedPromotionId, setSelectedPromotionId] = useState<number | null>(null);
  const [days, setDays] = useState("");
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const promotionsData = await api<Promotion[]>("/promotion/all-promotions");
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

      // Получаем только активные и одобренные товары пользователя
      const products = await getCurrentUserProducts(currentUser.id);
      const activeProducts = (products || []).filter(
        (p) => !p.isHide && (p.moderateState === "APPROVED" || !p.moderateState)
      );
      setUserProducts(activeProducts);
      if (activeProducts.length === 1) {
        setSelectedProductId(activeProducts[0].id);
      }
      if (!days) {
        setDays("3");
      }
    } catch (error: any) {
      console.error("Ошибка загрузки товаров:", error);
      toast.error("Не удалось загрузить список товаров");
      setShowActivatePromotion(false);
    } finally {
      setIsLoadingProducts(false);
    }
  };

  const handleActivatePromotion = async () => {
    if (!selectedProductId) {
      toast.error("Пожалуйста, выберите товар для продвижения (нажмите на карточку товара)");
      return;
    }
    if (!selectedPromotionId) {
      toast.error("Тариф продвижения не выбран");
      return;
    }
    if (!days.trim()) {
      toast.error("Укажите количество дней продвижения");
      return;
    }

    const daysNum = Number.parseInt(days, 10);
    if (isNaN(daysNum) || daysNum < 1) {
      toast.error("Введите корректное количество дней (минимум 1)");
      return;
    }

    const promo = promotions.find((p) => p.id === selectedPromotionId);
    const requiredCost = (promo?.pricePerDay || 0) * daysNum;

    if (requiredCost > totalAvailable) {
      toast.error(`Недостаточно средств. Требуется: ${requiredCost} ₽, доступно: ${totalAvailable} ₽ (баланс: ${mainBalance} ₽, бонусы: ${bonusBalance} ₽). Пополните баланс в профиле.`);
      return;
    }

    try {
      setIsSubmitting(true);
      await addPromotion({
        productId: selectedProductId,
        promotionId: selectedPromotionId,
        days: daysNum,
      });
      toast.success("Продвижение успешно активировано!");
      queryClient.invalidateQueries({ queryKey: ["user"] });
      closeModals();
    } catch (error: any) {
      console.error("Ошибка активации продвижения:", error);
      const errorMessage = error?.data?.message || error?.message || error?.response?.data?.message || "Не удалось активировать продвижение";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Typography className="text-3xl font-bold">Продвижение товаров</Typography>
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
          <Typography className="text-3xl font-bold">Продвижение товаров</Typography>
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
              <p className="col-span-full py-8 text-center text-gray-500">Нет типов продвижения</p>
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
                    <h4 className="mb-3 text-2xl font-bold text-gray-900">{promotion.name}</h4>
                    <div className="mb-4 flex items-baseline gap-1">
                      <span className="text-3xl font-bold text-blue-600">
                        {promotion.pricePerDay}
                      </span>
                      <span className="text-sm font-medium text-gray-600">₽ / день</span>
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
                <h3 className="text-2xl font-semibold">Активировать продвижение товара</h3>
                {selectedPromotionId && (
                  <p className="mt-1 text-sm text-gray-600">
                    Тариф:{" "}
                    <span className="font-semibold text-blue-600">
                      {promotions.find((p) => p.id === selectedPromotionId)?.name}
                    </span>
                    {" — "}
                    {promotions.find((p) => p.id === selectedPromotionId)?.pricePerDay} ₽ / день
                  </p>
                )}
              </div>
              <button className="rounded p-1 hover:bg-gray-100" type="button" onClick={closeModals}>
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
                    <div className="mt-2 text-sm text-gray-600 space-y-1">
                      <p>
                        Итого к оплате:{" "}
                        <span className="font-semibold text-blue-600">
                          {(
                            (promotions.find((p) => p.id === selectedPromotionId)?.pricePerDay || 0) *
                            Number.parseInt(days, 10)
                          ).toFixed(0)}{" "}
                          ₽
                        </span>
                        {currentUser && (
                          <span className="ml-2 text-gray-500">
                            (Доступно на балансе: {totalAvailable} ₽
                            {bonusBalance > 0 ? ` · в т.ч. бонусы: ${bonusBalance} ₽` : ""})
                          </span>
                        )}
                      </p>
                      {(() => {
                        const promo = promotions.find((p) => p.id === selectedPromotionId);
                        const cost = (promo?.pricePerDay || 0) * (Number.parseInt(days, 10) || 0);
                        if (cost > totalAvailable) {
                          return (
                            <p className="text-xs text-red-600 font-medium">
                              ⚠️ Недостаточно средств на балансе. Для активации пополните баланс в профиле.
                            </p>
                          );
                        }
                        return null;
                      })()}
                    </div>
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
                disabled={isSubmitting}
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
