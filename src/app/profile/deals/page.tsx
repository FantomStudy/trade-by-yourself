"use client";

import type { Deal, DealCdekQrResponse } from "@/types";

import { useMemo, useState } from "react";
import { toast } from "sonner";

import { useCancelDealMutation, useMyDeals, usePayDealMutation, useShipDealMutation } from "@/api/hooks";
import { Input, Typography } from "@/components/ui";
import { Button } from "@/components/ui/Button";
import { getApiErrorMessage } from "@/lib/api/get-api-error-message";
import { getDealCdekQr, syncDealPayment } from "@/lib/api/requests";
import { toCurrency } from "@/lib/format";

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
  return toCurrency(value);
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

/** Подсказка по UUID/трек — приходит с API (registrationHint), без устаревшего текста про «только вручную». */
function getCdekRegistrationHint(deal: Deal): string | null {
  const fromApi = deal.cdek.registrationHint?.trim();
  if (fromApi) return fromApi;
  if (deal.cdek.orderUuid?.trim()) return null;
  if (deal.myRole === "buyer") {
    return "Нажми «Оплатить» выше, затем после реальной оплаты — «Обновить статус оплаты» (если вебхук Тинькофф не дошёл до сервера).";
  }
  return null;
}

/** Собираем картинку или ссылку на PDF из ответа CDEK (url / base64). */
function buildCdekQrMedia(payload: DealCdekQrResponse): { kind: "img"; src: string } | { kind: "file"; href: string } | null {
  const rawUrl = payload.qrCodeUrl?.trim();
  const rawData = payload.qrCodeData?.trim();
  if (rawUrl) {
    const lower = rawUrl.toLowerCase();
    if (lower.endsWith(".pdf") || lower.includes("application/pdf")) {
      return { kind: "file", href: rawUrl };
    }
    return { kind: "img", src: rawUrl };
  }
  if (rawData) {
    if (rawData.startsWith("data:") || rawData.startsWith("http")) {
      if (rawData.toLowerCase().endsWith(".pdf")) {
        return { kind: "file", href: rawData };
      }
      return { kind: "img", src: rawData };
    }
    return { kind: "img", src: `data:image/png;base64,${rawData}` };
  }
  return null;
}

function CdekQrImg({ src }: { src: string }) {
  // Внешние URL и data: от CDEK — next/image без смысла, remotePatterns не покрывают api.cdek.ru.
  return <img alt="Штрихкод CDEK для ПВЗ" className={styles.qrImage} src={src} />;
}

const DealsPage = () => {
  const [filter, setFilter] = useState<DealFilter>("all");
  const [trackByDealId, setTrackByDealId] = useState<Record<number, string>>({});
  const [orderUuidByDealId, setOrderUuidByDealId] = useState<Record<number, string>>({});
  const [cdekQrByDealId, setCdekQrByDealId] = useState<Record<number, DealCdekQrResponse>>({});
  const [cdekQrLoadingId, setCdekQrLoadingId] = useState<number | null>(null);
  const [syncPayLoadingId, setSyncPayLoadingId] = useState<number | null>(null);
  const { data: deals = [], isLoading, isFetching, refetch } = useMyDeals();
  const cancelDealMutation = useCancelDealMutation();
  const payDealMutation = usePayDealMutation();
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

    if (hasPvz && !cdekTrackNumber && !cdekOrderUuid) {
      toast.error("Для ПВЗ укажи трек или UUID заказа CDEK — бэк сам подтянет трек по UUID");
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

  const handlePayDeal = async (deal: Deal) => {
    const existingUrl = deal.paymentUrl?.trim();
    if (existingUrl) {
      window.open(existingUrl, "_blank", "noopener,noreferrer");
      toast.message("Если оплата прошла — нажми «Обновить статус оплаты».");
      return;
    }
    try {
      const res = await payDealMutation.mutateAsync(deal.id);
      if (res.mockPayment) {
        toast.success("Сделка оплачена (режим без Тинькофф, см. DEAL_ALLOW_MOCK_PAYMENT на сервере)");
        return;
      }
      const url = res.paymentUrl?.trim();
      if (url) {
        window.open(url, "_blank", "noopener,noreferrer");
        toast.success("Открыли оплату Тинькофф. После оплаты нажми «Обновить статус оплаты».");
      } else {
        toast.success("Платёж создан");
      }
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Не удалось начать оплату"));
    }
  };

  const handleSyncDealPayment = async (dealId: number) => {
    setSyncPayLoadingId(dealId);
    try {
      await syncDealPayment(dealId);
      toast.success("Статус оплаты обновлён");
      await refetch();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Оплата ещё не подтверждена"));
    } finally {
      setSyncPayLoadingId(null);
    }
  };

  const handleLoadCdekQr = async (dealId: number) => {
    setCdekQrLoadingId(dealId);
    try {
      const payload = await getDealCdekQr(dealId);
      setCdekQrByDealId((prev) => ({ ...prev, [dealId]: payload }));
      await refetch();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Не удалось получить QR из CDEK"));
    } finally {
      setCdekQrLoadingId(null);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <Typography variant="h1">Безопасные сделки</Typography>
        <Button disabled={isFetching} type="button" variant="success" onClick={() => refetch()}>
          Обновить
        </Button>
      </div>

      <div className={styles.filters}>
        {FILTER_BUTTONS.map((item) => (
          <Button
            key={item.key}
            type="button"
            variant={filter === item.key ? "primary" : "success"}
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
            const cdekRegHint = getCdekRegistrationHint(deal);
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

                {deal.myRole === "buyer" && deal.statusCode === "CREATED" ? (
                  <div className={styles.actionsRow}>
                    {deal.paymentUrl?.trim() ? (
                      <Button
                        type="button"
                        variant="success"
                        onClick={() => {
                          window.open(deal.paymentUrl!.trim(), "_blank", "noopener,noreferrer");
                          toast.message("После оплаты нажми «Обновить статус оплаты».");
                        }}
                      >
                        Открыть оплату (Тинькофф)
                      </Button>
                    ) : null}
                    <Button
                      disabled={payDealMutation.isPending && payDealMutation.variables === deal.id}
                      type="button"
                      variant="primary"
                      onClick={() => handlePayDeal(deal)}
                    >
                      {payDealMutation.isPending && payDealMutation.variables === deal.id
                        ? "Создаём платёж…"
                        : deal.paymentUrl?.trim()
                          ? "Обновить ссылку на оплату"
                          : "Оплатить"}
                    </Button>
                  </div>
                ) : null}

                {deal.myRole === "buyer" &&
                deal.statusCode === "CREATED" &&
                deal.paymentId?.trim() &&
                !deal.paymentId.trim().toLowerCase().startsWith("mock-") ? (
                  <div className={styles.actionsRow}>
                    <Button
                      disabled={syncPayLoadingId === deal.id}
                      type="button"
                      variant="success"
                      onClick={() => handleSyncDealPayment(deal.id)}
                    >
                      {syncPayLoadingId === deal.id ? "Проверяем Тинькофф…" : "Обновить статус оплаты"}
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
                          value={trackByDealId[deal.id] ?? deal.cdek.trackNumber ?? ""}
                          placeholder="Трек-номер CDEK *"
                          onChange={(event) =>
                            setTrackByDealId((prev) => ({ ...prev, [deal.id]: event.target.value }))
                          }
                        />
                        <Input
                          className={styles.shipInput}
                          value={orderUuidByDealId[deal.id] ?? deal.cdek.orderUuid ?? ""}
                          placeholder="UUID заказа CDEK (можно без трека — подтянется)"
                          onChange={(event) =>
                            setOrderUuidByDealId((prev) => ({
                              ...prev,
                              [deal.id]: event.target.value,
                            }))
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
                      <span className={styles.infoValue}>
                        {formatMoney(deal.amounts.productAmount)}
                      </span>
                    </div>
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>Доставка</span>
                      <span className={styles.infoValue}>
                        {formatMoney(deal.amounts.deliveryCost)}
                      </span>
                    </div>
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>Итого к оплате</span>
                      <span className={styles.infoValueStrong}>
                        {formatMoney(deal.amounts.totalAmount)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className={styles.section}>
                  <Typography variant="h2">Доставка CDEK</Typography>
                  <div className={styles.infoGrid}>
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>Тариф</span>
                      <span className={styles.infoValue}>
                        {deal.cdek.tariffName ?? `Код ${deal.cdek.tariffCode}`}
                      </span>
                    </div>
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>Трек-номер</span>
                      <span className={styles.infoValue}>
                        {deal.cdek.trackNumber?.trim()
                          ? deal.cdek.trackNumber
                          : deal.cdek.trackPending
                            ? "Ждём от CDEK…"
                            : "Ещё не присвоен"}
                      </span>
                    </div>
                    {deal.cdek.trackingUrl ? (
                      <div className={styles.infoItem}>
                        <span className={styles.infoLabel}>Трекинг</span>
                        <a className={styles.trackingLink} href={deal.cdek.trackingUrl} rel="noreferrer" target="_blank">
                          Открыть на cdek.ru
                        </a>
                      </div>
                    ) : null}
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>UUID заказа CDEK</span>
                      <span className={styles.infoValue}>
                        {deal.cdek.orderUuid?.trim() ? deal.cdek.orderUuid : "Не указан"}
                      </span>
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
                          {deal.cdek.sellerHandoffHint?.trim() ??
                            (deal.cdek.toPvzCode
                              ? `Передайте отправление в CDEK для выдачи в ПВЗ покупателя: ${deal.cdek.toPvzCode}.`
                              : "Ожидается выбор ПВЗ покупателя.")}
                        </span>
                      </div>
                    )}
                  </div>
                  {cdekRegHint ? <p className={styles.cdekHint}>{cdekRegHint}</p> : null}
                  {deal.cdek.orderUuid?.trim() ? (
                    <div className={styles.pickupQrBlock}>
                      <Typography variant="h3">Штрихкод для ПВЗ</Typography>
                      <p className={styles.pickupHint}>
                        {deal.myRole === "buyer"
                          ? "Забираешь посылку — нажми, подтянем штрихкод с CDEK. Покажи экран сотруднику в ПВЗ."
                          : "Штрихкод заказа в CDEK по этой сделке (если нужен для ПВЗ или печати)."}
                      </p>
                      <Button
                        disabled={cdekQrLoadingId === deal.id}
                        type="button"
                        variant="success"
                        onClick={() => handleLoadCdekQr(deal.id)}
                      >
                        {cdekQrLoadingId === deal.id ? "Грузим из CDEK…" : "Получить QR из CDEK"}
                      </Button>
                      {cdekQrByDealId[deal.id] ? (
                        <div className={styles.qrResult}>
                          {cdekQrByDealId[deal.id].trackNumber ? (
                            <div className={styles.infoItem}>
                              <span className={styles.infoLabel}>Трек (с сервера CDEK)</span>
                              <span className={styles.infoValue}>{cdekQrByDealId[deal.id].trackNumber}</span>
                            </div>
                          ) : null}
                          {cdekQrByDealId[deal.id].trackingUrl ? (
                            <a
                              className={styles.trackingLink}
                              href={cdekQrByDealId[deal.id].trackingUrl ?? undefined}
                              rel="noreferrer"
                              target="_blank"
                            >
                              Отследить на cdek.ru
                            </a>
                          ) : null}
                          {(() => {
                            const media = buildCdekQrMedia(cdekQrByDealId[deal.id]);
                            if (!media) {
                              return <span className={styles.infoValue}>Нет данных изображения</span>;
                            }
                            if (media.kind === "file") {
                              return (
                                <a className={styles.trackingLink} href={media.href} rel="noreferrer" target="_blank">
                                  Открыть штрихкод CDEK (файл)
                                </a>
                              );
                            }
                            return <CdekQrImg src={media.src} />;
                          })()}
                        </div>
                      ) : null}
                    </div>
                  ) : null}
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
