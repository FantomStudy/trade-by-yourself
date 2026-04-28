"use client";

import type { ExtendedProduct } from "@/types";

import { useState } from "react";
import { toast } from "sonner";

import {
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

import styles from "./reservation-form.module.css";

interface ReservationFormProps {
  product: ExtendedProduct;
}

function getReservationUntil(rawDate?: string | null) {
  if (!rawDate) return null;
  const date = new Date(rawDate);
  if (Number.isNaN(date.getTime())) return null;
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

export const ReservationForm = ({ product }: ReservationFormProps) => {
  const [open, setOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [hours, setHours] = useState(24);
  const [note, setNote] = useState("");

  const { data: currentUser } = useCurrentUser();
  const { data: reservationInfo } = useProductReservation(product.id);
  const createReservationMutation = useCreateReservationMutation(product.id);

  const reservedUntil =
    getReservationUntil(reservationInfo?.reservedUntil) ??
    getReservationUntil(reservationInfo?.expiresAt) ??
    getReservationUntil(reservationInfo?.reservation?.expiresAt);

  const isReserved = Boolean(reservationInfo?.isReserved);

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
        hours,
        note: note.trim() || undefined,
      });
      toast.success("Резерв создан");
      setOpen(false);
      setNote("");
      setHours(24);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Не удалось создать резерв"));
    }
  };

  return (
    <>
      <div className={styles.container}>
        {isReserved && (
          <Typography className={styles.reservedText}>
            Зарезервировано{reservedUntil ? ` до ${reservedUntil}` : ""}
          </Typography>
        )}
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
              Укажи срок резерва и комментарий для продавца (необязательно).
            </DialogDescription>
          </DialogHeader>

          <div className={styles.form}>
            <label className={styles.fieldGroup}>
              <span className={styles.label}>Срок резерва, часов</span>
              <Input
                min={1}
                type="number"
                value={hours}
                onChange={(event) => setHours(Number(event.target.value))}
              />
            </label>
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
              disabled={createReservationMutation.isPending || hours < 1}
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
