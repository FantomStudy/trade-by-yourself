"use client";

import type { Product } from "@/api/products";
import { TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getUserProducts } from "@/api/products";
import { addPromotion, getPromotions } from "@/api/promotions";
import { Button, Input, Typography } from "@/components/ui";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { ProductSelector } from "../_components/ProductSelector";
import styles from "./page.module.css";

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
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [selectedPromotionId, setSelectedPromotionId] = useState<number | null>(null);
  const [days, setDays] = useState("");
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const promotionsData = await getPromotions();
      setPromotions(promotionsData);
    } catch (error) {
      console.error("Ошибка загрузки данных:", error);
      toast.error("Не удалось загрузить данные");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

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
      const products = await getUserProducts(currentUser.id);
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
    if (Number.isNaN(daysNum) || daysNum < 1) {
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
      const errorMessage = error.response?.data?.message || "Не удалось активировать продвижение";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className={styles.page}>
        <div className={styles.header}>
          <Typography className={styles.title}>Продвижение товаров</Typography>
          <Typography className={styles.subtitle}>Управление типами продвижения товаров</Typography>
        </div>
        <div className={styles.loadingCard}>
          <div className={styles.spinner} />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.contentGrid}>
        {/* Заголовок */}
        <div className={styles.header}>
          <Typography className={styles.title}>Продвижение товаров</Typography>
          <Typography className={styles.subtitle}>
            Выберите тип продвижения и товар для активации
          </Typography>
        </div>

        {/* Типы продвижения */}
        <div className={styles.promotionsCard}>
          <div className={styles.promotionsHeader}>
            <h3 className={styles.promotionsTitle}>Типы продвижения</h3>
          </div>

          <div className={styles.promotionsGrid}>
            {promotions.length === 0 ? (
              <p className={styles.emptyPromotions}>Нет типов продвижения</p>
            ) : (
              promotions.map((promotion) => (
                <div key={promotion.id} className={styles.promotionItem}>
                  <div className={styles.promotionGlow} />
                  <div className={styles.promotionInner}>
                    <div className={styles.promotionHeadRow}>
                      <div className={styles.promotionIconWrap}>
                        <TrendingUp className={styles.promotionIcon} />
                      </div>
                      <div className={styles.promotionDivider} />
                      <div>
                        <p className={styles.promotionLabel}>Тариф</p>
                      </div>
                    </div>
                    <h4 className={styles.promotionName}>{promotion.name}</h4>
                    <div className={styles.promotionPriceRow}>
                      <span className={styles.promotionPriceValue}>{promotion.pricePerDay}</span>
                      <span className={styles.promotionPriceUnit}>₽ / день</span>
                    </div>
                    <Button
                      className={styles.selectProductButton}
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
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <div>
                <h3 className={styles.modalTitle}>Активировать продвижение товара</h3>
                {selectedPromotionId && (
                  <p className={styles.modalSubtitle}>
                    Тариф:{" "}
                    <span className={styles.modalTariffName}>
                      {promotions.find((p) => p.id === selectedPromotionId)?.name}
                    </span>
                    {" — "}
                    {promotions.find((p) => p.id === selectedPromotionId)?.pricePerDay} ₽ / день
                  </p>
                )}
              </div>
              <button className={styles.modalCloseButton} type="button" onClick={closeModals}>
                ✕
              </button>
            </div>

            {isLoadingProducts ? (
              <div className={styles.modalLoadingWrap}>
                <div className={styles.spinner} />
              </div>
            ) : (
              <div className={styles.modalSteps}>
                {/* Шаг 1: Выбор товара */}
                <div>
                  <label className={styles.stepLabel}>1. Выберите товар для продвижения</label>
                  <ProductSelector
                    products={userProducts}
                    selectedProductId={selectedProductId}
                    onSelectProduct={setSelectedProductId}
                  />
                </div>

                {/* Шаг 2: Количество дней */}
                <div>
                  <label className={styles.stepLabel}>2. Укажите количество дней</label>
                  <Input
                    min="1"
                    type="number"
                    value={days}
                    onChange={(e) => setDays(e.target.value)}
                    placeholder="Например: 7"
                  />
                  {selectedPromotionId && days && (
                    <p className={styles.totalHint}>
                      Итого:{" "}
                      <span className={styles.totalHintValue}>
                        {(
                          (promotions.find((p) => p.id === selectedPromotionId)?.pricePerDay || 0) *
                          Number.parseInt(days, 10)
                        ).toFixed(0)}{" "}
                        ₽
                      </span>
                    </p>
                  )}
                </div>
              </div>
            )}

            <div className={styles.modalActions}>
              <Button variant="danger" onClick={closeModals}>
                Отмена
              </Button>
              <Button
                className={styles.activateButton}
                disabled={isSubmitting || !selectedProductId || !selectedPromotionId || !days}
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
