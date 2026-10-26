"use client";

import type { Reservation } from "@/types";

import { useQueries } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { useCancelReservationMutation, useCurrentUser, useMyReservations } from "@/api/hooks";
import { getProductById } from "@/api/requests";
import { Input, Typography } from "@/components/ui";
import { Button } from "@/components/ui/Button";
import { getApiErrorMessage } from "@/lib/api/get-api-error-message";
import { toCurrency } from "@/lib/format";

import styles from "./page.module.css";

function formatDate(value?: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString("ru-RU");
}

function normalizedReservationStatus(status?: string | null) {
  return (status ?? "").trim().toUpperCase();
}

function isCancelledStatus(reservation: Reservation) {
  const code = normalizedReservationStatus(reservation.statusCode);
  const status = normalizedReservationStatus(reservation.status);
  return (
    code.includes("CANCELLED") ||
    code.includes("CANCELED") ||
    status.includes("CANCELLED") ||
    status.includes("CANCELED") ||
    status.includes("ОТМЕН")
  );
}

function isReservationExpired(reservation: Reservation) {
  const code = normalizedReservationStatus(reservation.statusCode);
  const status = normalizedReservationStatus(reservation.status);
  if (code === "EXPIRED" || status === "EXPIRED" || status.includes("ИСТЕК")) {
    return true;
  }
  const until = reservation.expiresAt ?? reservation.reservedUntil;
  if (until) {
    const untilMs = new Date(until).getTime();
    if (!Number.isNaN(untilMs) && untilMs <= Date.now()) {
      return true;
    }
  }
  return false;
}

function isDealCreated(reservation: Reservation) {
  const code = normalizedReservationStatus(reservation.statusCode);
  const status = normalizedReservationStatus(reservation.status);
  return code === "DEAL_CREATED" || status === "DEAL_CREATED" || status.includes("СДЕЛКА");
}

function isReservationActive(reservation: Reservation) {
  if (isCancelledStatus(reservation)) return false;
  if (isDealCreated(reservation)) return false;
  if (isReservationExpired(reservation)) return false;
  const code = normalizedReservationStatus(reservation.statusCode);
  const status = normalizedReservationStatus(reservation.status);
  if (code === "COMPLETED" || status.includes("ЗАВЕРШ")) return false;
  return true;
}

function isReservationCancelled(reservation: Reservation) {
  return isCancelledStatus(reservation);
}

function reservationStatusLabel(reservation: Reservation) {
  if (isCancelledStatus(reservation)) {
    const code = normalizedReservationStatus(reservation.statusCode);
    const status = normalizedReservationStatus(reservation.status);
    if (code.includes("BUYER") || status.includes("ПОКУПАТЕЛ")) {
      return "Отменён покупателем";
    }
    if (code.includes("SELLER") || status.includes("ПРОДАВЦ")) {
      return "Отменён продавцом";
    }
    return "Отменён";
  }
  if (isDealCreated(reservation)) {
    return "Сделка создана";
  }
  if (isReservationExpired(reservation)) {
    return "Истёк";
  }
  const code = normalizedReservationStatus(reservation.statusCode);
  const status = normalizedReservationStatus(reservation.status);
  if (code === "COMPLETED" || status.includes("ЗАВЕРШ")) {
    return "Завершён";
  }
  return "Активен";
}

/** Непустые URL картинок из ответа резерва */
function reservationImageUrls(reservation: Reservation) {
  const raw = reservation.product?.images;
  if (!Array.isArray(raw)) return [];
  return raw.filter((u): u is string => typeof u === "string" && u.length > 0);
}

const PRODUCT_CARD_QUERY_KEY = "product-card" as const;

const ReservationsPage = () => {
  const [sellerReasons, setSellerReasons] = useState<Record<number, string>>({});
  const { data: currentUser } = useCurrentUser();
  const { data: reservations = [], isLoading, isFetching, refetch } = useMyReservations();
  const cancelMutation = useCancelReservationMutation();

  // В /reservations/my бэк часто не кладёт images в вложенный product — тянем ту же карточку, что и лента/страница товара
  const productIdsNeedingCard = useMemo(() => {
    const ids = new Set<number>();
    for (const r of reservations) {
      const id = r.product?.id ?? r.productId;
      if (!id) continue;
      if (reservationImageUrls(r).length === 0) ids.add(id);
    }
    return [...ids].sort((a, b) => a - b);
  }, [reservations]);

  const productCardQueries = useQueries({
    queries: productIdsNeedingCard.map((id) => ({
      queryKey: [PRODUCT_CARD_QUERY_KEY, id] as const,
      queryFn: () => getProductById(id),
      enabled: !isLoading && productIdsNeedingCard.length > 0,
      staleTime: 60_000,
    })),
  });

  const productCardById = useMemo(() => {
    const map = new Map<number, NonNullable<(typeof productCardQueries)[0]["data"]>>();
    productIdsNeedingCard.forEach((id, i) => {
      const data = productCardQueries[i]?.data;
      if (data) map.set(id, data);
    });
    return map;
  }, [productCardQueries, productIdsNeedingCard]);

  const imageFetchMetaByProductId = useMemo(() => {
    const map = new Map<number, { isPending: boolean }>();
    productIdsNeedingCard.forEach((id, i) => {
      const q = productCardQueries[i];
      if (q) map.set(id, { isPending: q.isPending });
    });
    return map;
  }, [productCardQueries, productIdsNeedingCard]);

  const buyerReservations = useMemo(() => {
    return reservations.filter((reservation) => {
      if (reservation.myRole) return reservation.myRole === "buyer";
      if (!currentUser?.id) return false;
      return reservation.buyerId === currentUser.id || reservation.buyer?.id === currentUser.id;
    });
  }, [currentUser?.id, reservations]);
  const sellerReservations = useMemo(() => {
    return reservations.filter((reservation) => {
      if (reservation.myRole) return reservation.myRole === "seller";
      if (!currentUser?.id) return false;
      return reservation.sellerId === currentUser.id || reservation.seller?.id === currentUser.id;
    });
  }, [currentUser?.id, reservations]);

  const handleCancel = async (id: number, reason?: string) => {
    try {
      await cancelMutation.mutateAsync({ id, reason: reason?.trim() || undefined });
      toast.success("Резерв отменён");
      setSellerReasons((prev) => ({ ...prev, [id]: "" }));
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Не удалось отменить резерв"));
    }
  };

  const renderReservation = (reservation: Reservation) => {
    const productId = reservation.product?.id ?? reservation.productId;
    const card = productId ? productCardById.get(productId) : undefined;
    const name = reservation.product?.name ?? card?.name ?? reservation.productName ?? "Товар";
    const fromReservation = reservationImageUrls(reservation);
    const images =
      fromReservation.length > 0 ? fromReservation : (card?.images?.filter(Boolean) ?? []);
    const firstImage = images[0];
    const price = reservation.product?.price ?? card?.price;
    const imageLoadPending =
      !!productId &&
      fromReservation.length === 0 &&
      (imageFetchMetaByProductId.get(productId)?.isPending ?? false);
    const until = reservation.expiresAt ?? reservation.reservedUntil;
    const isBuyer =
      reservation.myRole === "buyer" ||
      reservation.buyerId === currentUser?.id ||
      reservation.buyer?.id === currentUser?.id;
    const counterpartyLabel = isBuyer ? "Продавец" : "Покупатель";
    const counterpartyName = isBuyer
      ? (reservation.seller?.fullName ?? reservation.sellerName ?? "—")
      : (reservation.buyer?.fullName ?? reservation.buyerName ?? "—");
    const canCancel = isReservationActive(reservation);
    const isCancelled = isReservationCancelled(reservation);
    const isExpired = !canCancel && !isCancelled && isReservationExpired(reservation);
    const isDeal = !canCancel && !isCancelled && isDealCreated(reservation);

    const cardInner = (
      <>
        <div className={styles.imageWrap}>
          {firstImage ? (
            <Image
              alt={name}
              className={styles.coverImage}
              fill
              sizes="(max-width: 640px) 45vw, 200px"
              src={firstImage}
            />
          ) : imageLoadPending ? (
            <div className={styles.imagePlaceholder}>Загрузка фото…</div>
          ) : (
            <div className={styles.imagePlaceholder}>Нет фото</div>
          )}
        </div>
        <div className={styles.cardBody}>
          <div className={styles.priceRow}>
            <span className={styles.reserveId}>№{reservation.id}</span>
            {typeof price === "number" && Number.isFinite(price) ? (
              <span className={styles.price}>{toCurrency(price)}</span>
            ) : (
              <span className={styles.priceMissing}>Цена на странице товара</span>
            )}
          </div>
          <span className={styles.title}>{name}</span>
          <span className={styles.badge}>{reservationStatusLabel(reservation)}</span>
          <p className={styles.meta}>
            <span className={styles.metaStrong}>До:</span> {formatDate(until)}
            <br />
            <span className={styles.metaStrong}>{counterpartyLabel}:</span> {counterpartyName}
            <br />
            <span className={styles.metaStrong}>Создан:</span> {formatDate(reservation.createdAt)}
          </p>
        </div>
      </>
    );

    return (
      <article key={reservation.id} className={styles.productCard}>
        {productId ? (
          <Link className={styles.cardLink} href={`/product/${productId}`}>
            {cardInner}
          </Link>
        ) : (
          <div className={styles.cardLink}>{cardInner}</div>
        )}

        {isCancelled ? (
          <div className={styles.cardFooter}>
            <div className={styles.actionsRow}>
              <Button disabled type="button" variant="secondary">
                Резерв отменён
              </Button>
            </div>
          </div>
        ) : null}

        {isDeal ? (
          <div className={styles.cardFooter}>
            <div className={styles.actionsRow}>
              <Button disabled type="button" variant="secondary">
                Сделка создана
              </Button>
            </div>
          </div>
        ) : null}

        {isExpired ? (
          <div className={styles.cardFooter}>
            <div className={styles.actionsRow}>
              <Button disabled type="button" variant="secondary">
                Срок резерва истёк
              </Button>
            </div>
          </div>
        ) : null}

        {canCancel && !isCancelled && !isExpired && !isDeal ? (
          <div className={styles.cardFooter}>
            {isBuyer ? (
              <div className={styles.actionsRow}>
                <Button
                  disabled={cancelMutation.isPending}
                  type="button"
                  variant="destructive"
                  onClick={() => handleCancel(reservation.id)}
                >
                  Отменить резерв
                </Button>
              </div>
            ) : (
              <div className={styles.actionsColumn}>
                <Input
                  value={sellerReasons[reservation.id] ?? ""}
                  onChange={(event) =>
                    setSellerReasons((prev) => ({ ...prev, [reservation.id]: event.target.value }))
                  }
                  placeholder="Причина отмены (необязательно)"
                />
                <Button
                  disabled={cancelMutation.isPending}
                  type="button"
                  variant="destructive"
                  onClick={() =>
                    handleCancel(reservation.id, sellerReasons[reservation.id] ?? undefined)
                  }
                >
                  Отменить как продавец
                </Button>
              </div>
            )}
          </div>
        ) : null}
      </article>
    );
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <Typography variant="h1">Мои резервы</Typography>
        <Button disabled={isFetching} type="button" variant="success" onClick={() => refetch()}>
          Обновить
        </Button>
      </div>

      {isLoading ? (
        <div className={styles.emptyState}>Загрузка резервов...</div>
      ) : (
        <>
          <div className={styles.section}>
            <Typography className={styles.sectionTitle} variant="h2">
              Я покупатель
            </Typography>
            {buyerReservations.length === 0 ? (
              <div className={styles.emptyState}>Резервов нет</div>
            ) : (
              <div className={styles.grid}>{buyerReservations.map(renderReservation)}</div>
            )}
          </div>

          <div className={styles.section}>
            <Typography className={styles.sectionTitle} variant="h2">
              Я продавец
            </Typography>
            {sellerReservations.length === 0 ? (
              <div className={styles.emptyState}>Резервов нет</div>
            ) : (
              <div className={styles.grid}>{sellerReservations.map(renderReservation)}</div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ReservationsPage;
