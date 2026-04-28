"use client";

import type { Reservation } from "@/types";

import { useMemo, useState } from "react";
import { toast } from "sonner";

import {
  useCancelReservationByBuyerMutation,
  useCancelReservationBySellerMutation,
  useCurrentUser,
  useExtendReservationMutation,
  useMyReservations,
} from "@/api/hooks";
import { Button, Input, Typography } from "@/components/ui";

import styles from "./page.module.css";

function formatDate(value?: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString("ru-RU");
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

const ReservationsPage = () => {
  const [sellerReasons, setSellerReasons] = useState<Record<number, string>>({});
  const { data: currentUser } = useCurrentUser();
  const { data: reservations = [], isLoading, isFetching, refetch } = useMyReservations();
  const extendMutation = useExtendReservationMutation();
  const cancelByBuyerMutation = useCancelReservationByBuyerMutation();
  const cancelBySellerMutation = useCancelReservationBySellerMutation();

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

  const handleExtend = async (id: number) => {
    try {
      await extendMutation.mutateAsync(id);
      toast.success("Резерв продлен");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Не удалось продлить резерв"));
    }
  };

  const handleCancelByBuyer = async (id: number) => {
    try {
      await cancelByBuyerMutation.mutateAsync(id);
      toast.success("Резерв отменен");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Не удалось отменить резерв"));
    }
  };

  const handleCancelBySeller = async (reservation: Reservation) => {
    const reason = sellerReasons[reservation.id]?.trim() ?? "";
    if (!reason) {
      toast.error("Укажи причину отмены");
      return;
    }

    try {
      await cancelBySellerMutation.mutateAsync({ id: reservation.id, reason });
      toast.success("Резерв отменен продавцом");
      setSellerReasons((prev) => ({ ...prev, [reservation.id]: "" }));
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Не удалось отменить резерв продавцом"));
    }
  };

  const renderReservation = (reservation: Reservation) => (
    <div key={reservation.id} className={styles.card}>
      <div className={styles.cardHeader}>
        <Typography variant="h2">Резерв #{reservation.id}</Typography>
        <span className={styles.badge}>{reservation.status}</span>
      </div>

      <Typography>Товар: {reservation.product?.name ?? reservation.productName ?? "—"}</Typography>
      <Typography>Покупатель: {reservation.buyer?.fullName ?? reservation.buyerName ?? "—"}</Typography>
      <Typography>Продавец: {reservation.seller?.fullName ?? reservation.sellerName ?? "—"}</Typography>
      <Typography>Истекает: {formatDate(reservation.expiresAt ?? reservation.reservedUntil)}</Typography>
      <Typography>Создан: {formatDate(reservation.createdAt)}</Typography>

      {(reservation.myRole === "buyer" ||
        reservation.buyerId === currentUser?.id ||
        reservation.buyer?.id === currentUser?.id) ? (
        <div className={styles.actions}>
          <Button
            disabled={extendMutation.isPending}
            type="button"
            variant="secondary"
            onClick={() => handleExtend(reservation.id)}
          >
            Продлить
          </Button>
          <Button
            disabled={cancelByBuyerMutation.isPending}
            type="button"
            variant="destructive"
            onClick={() => handleCancelByBuyer(reservation.id)}
          >
            Отменить
          </Button>
        </div>
      ) : (
        <div className={styles.actionsColumn}>
          <Input
            value={sellerReasons[reservation.id] ?? ""}
            onChange={(event) =>
              setSellerReasons((prev) => ({ ...prev, [reservation.id]: event.target.value }))
            }
            placeholder="Причина отмены, например: Товар недоступен"
          />
          <Button
            disabled={cancelBySellerMutation.isPending}
            type="button"
            variant="destructive"
            onClick={() => handleCancelBySeller(reservation)}
          >
            Отменить как продавец
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <Typography variant="h1">Мои резервы</Typography>
        <Button disabled={isFetching} type="button" variant="secondary" onClick={() => refetch()}>
          Обновить
        </Button>
      </div>

      {isLoading ? (
        <div className={styles.emptyState}>Загрузка резервов...</div>
      ) : (
        <>
          <div className={styles.section}>
            <Typography variant="h2">Я покупатель</Typography>
            {buyerReservations.length === 0 ? (
              <div className={styles.emptyState}>Резервов нет</div>
            ) : (
              <div className={styles.list}>{buyerReservations.map(renderReservation)}</div>
            )}
          </div>

          <div className={styles.section}>
            <Typography variant="h2">Я продавец</Typography>
            {sellerReservations.length === 0 ? (
              <div className={styles.emptyState}>Резервов нет</div>
            ) : (
              <div className={styles.list}>{sellerReservations.map(renderReservation)}</div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ReservationsPage;
