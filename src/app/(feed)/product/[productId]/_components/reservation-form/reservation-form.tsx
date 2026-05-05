"use client";

import type { ExtendedProduct, Reservation } from "@/types";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import {
  useCancelReservationMutation,
  useCreateReservationMutation,
  useCurrentUser,
  useProductReservation,
} from "@/api/hooks";
import { AuthDialog } from "@/components/auth-dialog";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Textarea,
  Typography,
} from "@/components/ui";
import { getServerNowMs } from "@/lib/server-time-offset";

import styles from "./reservation-form.module.css";

interface ReservationFormProps {
  product: ExtendedProduct;
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

function formatRemainingTime(remainingMs: number) {
  const totalSeconds = Math.max(0, Math.floor(remainingMs / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
}

/** Как в профиле: финальные статусы — отмена недоступна */
function isReservationActive(reservation: Reservation) {
  const terminalStatuses = new Set([
    "DEAL_CREATED",
    "CANCELLED_BY_BUYER",
    "CANCELLED_BY_SELLER",
    "EXPIRED",
  ]);
  return !terminalStatuses.has(reservation.status);
}

function userIsBuyer(reservation: Reservation, userId: number | undefined) {
  if (!userId) return false;
  if (reservation.myRole === "buyer") return true;
  return reservation.buyerId === userId || reservation.buyer?.id === userId;
}

/** Продавец по резерву или владелец карточки товара */
function userIsSeller(
  reservation: Reservation,
  userId: number | undefined,
  productSellerId: number,
) {
  if (!userId) return false;
  if (reservation.myRole === "seller") return true;
  return (
    reservation.sellerId === userId ||
    reservation.seller?.id === userId ||
    productSellerId === userId
  );
}

function isReservationCancelled(status: string | undefined) {
  return status === "CANCELLED_BY_BUYER" || status === "CANCELLED_BY_SELLER";
}

export const ReservationForm = ({ product }: ReservationFormProps) => {
  const [open, setOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [note, setNote] = useState("");
  const [sellerCancelReason, setSellerCancelReason] = useState("");
  const [remainingMs, setRemainingMs] = useState<number | null>(null);
  const [isExpired, setIsExpired] = useState(false);

  const { data: currentUser } = useCurrentUser();
  const { data: reservationInfo, refetch: refetchReservationInfo } = useProductReservation(product.id);
  const createReservationMutation = useCreateReservationMutation(product.id);
  const cancelReservationMutation = useCancelReservationMutation();

  const isReserved = Boolean(reservationInfo?.isReserved);
  const reservation = reservationInfo?.reservation ?? null;
  const canCancelReservation =
    Boolean(reservation && currentUser && isReservationActive(reservation));
  const isBuyerOnReservation = reservation ? userIsBuyer(reservation, currentUser?.id) : false;
  const isSellerOnReservation = reservation
    ? userIsSeller(reservation, currentUser?.id, product.seller.id)
    : false;
  const showCancelOnListing =
    canCancelReservation && (isBuyerOnReservation || isSellerOnReservation);
  const isCancelledReservation = isReservationCancelled(reservation?.status);
  const showCancelledReservationState =
    Boolean(reservation && isCancelledReservation && (isBuyerOnReservation || isSellerOnReservation));
  const countdownExpiresAt =
    reservationInfo?.reservation?.expiresAt ?? reservationInfo?.expiresAt ?? reservationInfo?.reservedUntil;

  useEffect(() => {
    if (!isReserved || !countdownExpiresAt) {
      setRemainingMs(null);
      setIsExpired(false);
      return;
    }

    const targetMs = new Date(countdownExpiresAt).getTime();
    if (Number.isNaN(targetMs)) {
      setRemainingMs(null);
      setIsExpired(false);
      return;
    }

    let intervalId: ReturnType<typeof setInterval> | null = null;

    const tick = () => {
      const diff = targetMs - getServerNowMs();
      if (diff <= 0) {
        setRemainingMs(0);
        setIsExpired(true);
        if (intervalId) clearInterval(intervalId);
        void refetchReservationInfo();
        return;
      }
      setRemainingMs(diff);
      setIsExpired(false);
    };

    tick();
    intervalId = setInterval(tick, 1000);

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [countdownExpiresAt, isReserved, refetchReservationInfo]);

  const handleCancelFromListing = async (reason?: string) => {
    if (!reservation?.id) return;
    try {
      await cancelReservationMutation.mutateAsync({
        id: reservation.id,
        reason: reason?.trim() || undefined,
      });
      toast.success("Резерв отменён");
      setSellerCancelReason("");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Не удалось отменить резерв"));
    }
  };

  const handleOpenReservation = () => {
    if (!currentUser) {
      setIsAuthOpen(true);
      return;
    }

    if (isReserved) {
      toast.error("Товар уже зарезервирован");
      return;
    }

    setOpen(true);
  };

  const handleCreateReservation = async () => {
    try {
      await createReservationMutation.mutateAsync({
        productId: product.id,
        note: note.trim() || undefined,
      });
      toast.success("Резерв на 24 часа создан");
      setOpen(false);
      setNote("");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Не удалось создать резерв"));
    }
  };

  return (
    <>
      <div className={styles.container}>
        {isReserved && (
          <>
            {remainingMs !== null && (
              <Typography className={styles.timerText}>
                {isExpired ? "Время резерва вышло" : `Осталось: ${formatRemainingTime(remainingMs)}`}
              </Typography>
            )}
          </>
        )}
        {showCancelledReservationState ? (
          <Button className={styles.button} disabled type="button" variant="secondary">
            Резерв уже отменён
          </Button>
        ) : null}
        {showCancelOnListing &&
          (isBuyerOnReservation ? (
            <Button
              className={styles.button}
              disabled={cancelReservationMutation.isPending}
              type="button"
              variant="destructive"
              onClick={() => void handleCancelFromListing()}
            >
              {cancelReservationMutation.isPending ? "Отмена…" : "Отменить резерв"}
            </Button>
          ) : (
            <div className={styles.sellerCancel}>
              <Input
                value={sellerCancelReason}
                placeholder="Причина отмены (необязательно)"
                onChange={(event) => setSellerCancelReason(event.target.value)}
              />
              <Button
                className={styles.button}
                disabled={cancelReservationMutation.isPending}
                type="button"
                variant="destructive"
                onClick={() => void handleCancelFromListing(sellerCancelReason)}
              >
                {cancelReservationMutation.isPending ? "Отмена…" : "Отменить как продавец"}
              </Button>
            </div>
          ))}
        <Button
          className={styles.button}
          disabled={isReserved}
          type="button"
          variant="secondary"
          onClick={handleOpenReservation}
        >
          {isReserved ? "Товар зарезервирован" : "Зарезервировать"}
        </Button>
      </div>

      <AuthDialog onOpenChange={setIsAuthOpen} open={isAuthOpen} />

      <Dialog onOpenChange={setOpen} open={open}>
        <DialogContent className={styles.dialog}>
          <DialogHeader>
            <DialogTitle>Резервация товара</DialogTitle>
            <DialogDescription>
              Срок резерва фиксирован: 24 часа. Можно добавить комментарий для продавца.
            </DialogDescription>
          </DialogHeader>

          <div className={styles.form}>
            <label className={styles.fieldGroup}>
              <span className={styles.label}>Комментарий</span>
              <Textarea
                value={note}
                onChange={(event) => setNote(event.target.value)}
                placeholder="Например: Готов оплатить завтра"
              />
            </label>
          </div>

          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
              Отмена
            </Button>
            <Button
              disabled={createReservationMutation.isPending}
              type="button"
              onClick={handleCreateReservation}
            >
              {createReservationMutation.isPending ? "Создаем..." : "Создать резерв"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
