"use client";

import type { Deal } from "@/types";

import { useMemo, useState } from "react";

import { useMyDeals } from "@/api/hooks";
import { Button, Typography } from "@/components/ui";
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

const DealsPage = () => {
  const [filter, setFilter] = useState<DealFilter>("all");
  const { data: deals = [], isLoading, isFetching, refetch } = useMyDeals();

  const filteredDeals = useMemo(() => getFilteredDeals(deals, filter), [deals, filter]);

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

                <Typography>Статус: {deal.status}</Typography>
                <Typography>Товар: {deal.product.name}</Typography>
                <Typography>Товар ID: {deal.product.id}</Typography>
                <Typography>Продавец: {deal.seller.fullName}</Typography>
                <Typography>Покупатель: {deal.buyer.fullName}</Typography>
                <Typography>Доставка: {formatMoney(deal.amounts.deliveryCost)}</Typography>
                <Typography>Сумма товара: {formatMoney(deal.amounts.productAmount)}</Typography>
                <Typography>Итого: {formatMoney(deal.amounts.totalAmount)}</Typography>
                <Typography>Тариф CDEK: {deal.cdek.tariffName ?? deal.cdek.tariffCode}</Typography>
                <Typography>Создана: {formatDate(deal.createdAt)}</Typography>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DealsPage;
