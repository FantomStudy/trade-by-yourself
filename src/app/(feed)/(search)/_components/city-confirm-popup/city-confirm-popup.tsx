"use client";

import { MapPin, X } from "lucide-react";

import styles from "./city-confirm-popup.module.css";
import { Button } from "@/components/ui-lab/Button";

interface CityConfirmPopupProps {
  city: string;
  onConfirm: () => void;
  onReject: () => void;
}

export const CityConfirmPopup = ({
  city,
  onConfirm,
  onReject,
}: CityConfirmPopupProps) => {
  return (
    <div className={styles.popup}>
      <button
        aria-label="Закрыть"
        className={styles.close}
        type="button"
        onClick={onReject}
      >
        <X size={16} />
      </button>
      <div className={styles.content}>
        <MapPin className={styles.icon} size={20} />
        <span className={styles.text}>Ваш город {city}?</span>
      </div>
      <div className={styles.actions}>
        <Button onClick={onConfirm}>Да</Button>
        <Button variant="success" onClick={onReject}>
          Нет
        </Button>
      </div>
    </div>
  );
};
