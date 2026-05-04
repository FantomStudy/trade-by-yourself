"use client";

import type { Deal } from "@/types";

import { useMemo, useState } from "react";
import { toast } from "sonner";

import { useCancelDealMutation, useMyDeals, useShipDealMutation } from "@/api/hooks";
import { Button, Input, Typography } from "@/components/ui";
import { formatPrice } from "@/lib/format";

import styles from "./page.module.css";

type DealFilter = "all" | "buyer" | "seller";

const FILTER_BUTTONS: Array<{ key: DealFilter; label: string }> = [
  { key: "all", label: "Все сделки" },
  { key: "buyer", label: "Мои покупки" },
  { key: "seller", label: "Мои продажи" },
];

function getFilteredDeals(deals: Deal[], filter: DealFilter) {
  if (filter === "all") return deals;
  return deals.filter((deal) => deal.myRole === filter);
}

function getDealRoleText(role?: Deal["myRole"]) {
  if (role === "buyer") return "Покупка";
  if (role === "seller") return "Продажа";
  return "Роль не определена";
}

function formatMoney(value: number | null | undefined) {
  if (typeof value !== "number" || Number.isNaN(value)) return "—";
  return formatPrice(value);
}

function formatDate(value: string | null | undefined) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString("ru-RU");
}

function getPvzText(deal: Deal) {
  const toPvzCode = deal.cdek.toPvzCode;
  if (!toPvzCode) return "ПВЗ не указан";
  return `ПВЗ покупателя: ${toPvzCode}`;
}

function canCancelDeal(deal: Deal) {
  return deal.statusCode === "CREATED" || deal.statusCode === "PAID";
}

function getApiErrorMessage(error: unknown, fallback: string) {
  if (typeof error === "object" && error !== null && "data" in error) {
    const data = (error as { data?: { message?: string } }).data;
    if (typeof data?.message === "string" && data.message.trim()) return data.message;
  }

  if (typeof error === "object" && error !== null && "message" in error) {
    const message = (error as { message?: string }).message;
    if (typeof message === "string" && message.trim()) return message;
  }

  return fallback;
}

function mapCancelError(error: unknown) {
  const message = getApiErrorMessage(error, "Не удалось отменить сделку");
  if (message.includes("Отменить можно только до оформления доставки")) {
    return "Отменить можно только до оформления доставки";
  }
  if (message.includes("Доставка уже оформлена, отмена недоступна")) {
    return "Доставка уже оформлена, отмена недоступна";
  }
  return message;
}

const DealsPage = () => {
  const [filter, setFilter] = useState<DealFilter>("all");
  const [trackByDealId, setTrackByDealId] = useState<Record<number, string>>({});
  const [orderUuidByDealId, setOrderUuidByDealId] = useState<Record<number, string>>({});
  const { data: deals = [], isLoading, isFetching, refetch } = useMyDeals();
  const cancelDealMutation = useCancelDealMutation();
  const shipDealMutation = useShipDealMutation();

  const filteredDeals = useMemo(() => getFilteredDeals(deals, filter), [deals, filter]);

  const handleCancelDeal = async (dealId: number) => {
    try {
      await cancelDealMutation.mutateAsync(dealId);
      toast.success("Сделка отменена");
    } catch (error) {
      toast.error(mapCancelError(error));
    }
  };

  const handleShipDeal = async (deal: Deal) => {
    const hasPvz = Boolean(deal.cdek.toPvzCode);
    const cdekTrackNumber = trackByDealId[deal.id]?.trim() ?? "";
    const cdekOrderUuid = orderUuidByDealId[deal.id]?.trim() ?? "";

    if (hasPvz && !cdekTrackNumber) {
      toast.error("Для доставки в ПВЗ нужен трек-номер");
      return;
    }

    try {
      await shipDealMutation.mutateAsync({
        id: deal.id,
        cdekTrackNumber: cdekTrackNumber || undefined,
        cdekOrderUuid: cdekOrderUuid || undefined,
      });
      toast.success("Заказ отправлен");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Не удалось отправить заказ"));
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <Typography variant="h1">Безопасные сделки</Typography>
        <Button disabled={isFetching} type="button" variant="secondary" onClick={() => refetch()}>
          Обновить
        </Button>
      </div>

      <div className={styles.filters}>
        {FILTER_BUTTONS.map((item) => (
          <Button
            key={item.key}
            type="button"
            variant={filter === item.key ? "default" : "secondary"}
            onClick={() => setFilter(item.key)}
          >
            {item.label}
          </Button>
        ))}
      </div>

      {isLoading ? (
        <div className={styles.emptyState}>Загрузка сделок...</div>
      ) : filteredDeals.length === 0 ? (
        <div className={styles.emptyState}>Сделки не найдены</div>
      ) : (
        <div className={styles.list}>
          {filteredDeals.map((deal) => {
            return (
              <div key={deal.id} className={styles.card}>
                <div className={styles.cardRow}>
                  <Typography variant="h2">Сделка #{deal.id}</Typography>
                  <span className={styles.badge}>{getDealRoleText(deal.myRole)}</span>
                </div>

                <div className={styles.topMeta}>
                  <span className={styles.status}>Статус: {deal.status}</span>
                  <span className={styles.date}>Создана: {formatDate(deal.createdAt)}</span>
                </div>

                {canCancelDeal(deal) ? (
                  <div className={styles.actionsRow}>
                    <Button
                      disabled={cancelDealMutation.isPending}
                      type="button"
                      variant="destructive"
                      onClick={() => handleCancelDeal(deal.id)}
                    >
                      Отменить сделку
                    </Button>
                  </div>
                ) : null}

                {deal.myRole === "seller" && deal.statusCode === "PAID" ? (
                  <div className={styles.shipBlock}>
                    <Typography variant="h2">Отправить заказ</Typography>
                    {deal.cdek.toPvzCode ? (
                      <div className={styles.shipInputs}>
                        <Input
                          className={styles.shipInput}
                          value={trackByDealId[deal.id] ?? ""}
                          placeholder="Трек-номер CDEK *"
                          onChange={(event) =>
                            setTrackByDealId((prev) => ({ ...prev, [deal.id]: event.target.value }))
                          }
                        />
                        <Input
                          className={styles.shipInput}
                          value={orderUuidByDealId[deal.id] ?? ""}
                          placeholder="UUID заказа (необязательно)"
                          onChange={(event) =>
                            setOrderUuidByDealId((prev) => ({ ...prev, [deal.id]: event.target.value }))
                          }
                        />
                      </div>
                    ) : null}
                    <Button
                      disabled={shipDealMutation.isPending}
                      type="button"
                      onClick={() => handleShipDeal(deal)}
                    >
                      Отправить заказ
                    </Button>
                  </div>
                ) : null}

                <div className={styles.section}>
                  <Typography variant="h2">Товар</Typography>
                  <div className={styles.infoGrid}>
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>Товар</span>
                      <span className={styles.infoValue}>{deal.product.name}</span>
                    </div>
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>ID товара</span>
                      <span className={styles.infoValue}>{deal.product.id}</span>
                    </div>
                  </div>
                </div>

                <div className={styles.section}>
                  <Typography variant="h2">Суммы</Typography>
                  <div className={styles.infoGrid}>
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>Сумма товара</span>
                      <span className={styles.infoValue}>{formatMoney(deal.amounts.productAmount)}</span>
                    </div>
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>Доставка</span>
                      <span className={styles.infoValue}>{formatMoney(deal.amounts.deliveryCost)}</span>
                    </div>
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>Итого к оплате</span>
                      <span className={styles.infoValueStrong}>{formatMoney(deal.amounts.totalAmount)}</span>
                    </div>
                  </div>
                </div>

                <div className={styles.section}>
                  <Typography variant="h2">Доставка CDEK</Typography>
                  <div className={styles.infoGrid}>
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>Тариф</span>
                      <span className={styles.infoValue}>{deal.cdek.tariffName ?? `Код ${deal.cdek.tariffCode}`}</span>
                    </div>
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>Трек-номер</span>
                      <span className={styles.infoValue}>{deal.cdek.trackNumber ?? "Ещё не присвоен"}</span>
                    </div>
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>UUID заказа CDEK</span>
                      <span className={styles.infoValue}>{deal.cdek.orderUuid ?? "Не указан"}</span>
                    </div>
                    {deal.myRole === "buyer" ? (
                      <div className={styles.infoItem}>
                        <span className={styles.infoLabel}>Ваш ПВЗ получения</span>
                        <span className={styles.infoValue}>{getPvzText(deal)}</span>
                      </div>
                    ) : (
                      <div className={styles.infoItem}>
                        <span className={styles.infoLabel}>Информация для продавца</span>
                        <span className={styles.infoValue}>
                          {deal.cdek.toPvzCode
                            ? `Передайте отправление в CDEK для выдачи в ПВЗ покупателя: ${deal.cdek.toPvzCode}.`
                            : "Ожидается выбор ПВЗ покупателя."}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DealsPage;
