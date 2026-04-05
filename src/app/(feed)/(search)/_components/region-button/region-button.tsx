"use client";

import { MapPin } from "lucide-react";
import { parseAsString, useQueryState } from "nuqs";
import { useEffect, useState } from "react";

import { Button } from "@/app/(feed)/(search)/_lib/ui/button";
import { getCityByIp } from "@/api/requests/address";

import { CityConfirmPopup } from "../city-confirm-popup";
import { RegionPicker } from "../region-picker";

import styles from "./region-button.module.css";

export const RegionButton = () => {
  const [region, setRegion] = useQueryState("region", parseAsString);
  const [regionPickerOpen, setRegionPickerOpen] = useState(false);
  const [detectedCity, setDetectedCity] = useState<string | null>(null);
  const [showCityConfirm, setShowCityConfirm] = useState(false);

  useEffect(() => {
    const detectCity = async () => {
      try {
        const result = await getCityByIp();
        if (result.city) {
          setDetectedCity(result.city);
          // Показываем попап каждый раз при загрузке
          setShowCityConfirm(true);
        }
      } catch (error) {
        console.error("Ошибка определения города:", error);
      }
    };

    detectCity();
  }, []);

  const handleConfirmCity = () => {
    // Только при подтверждении устанавливаем город в фильтр
    if (detectedCity) {
      setRegion(detectedCity);
    }
    setShowCityConfirm(false);
  };

  const handleRejectCity = () => {
    setShowCityConfirm(false);
    setRegionPickerOpen(true);
  };

  return (
    <div className={styles.wrapper}>
      <Button
        aria-label="Выбрать регион"
        className={styles.button}
        type="button"
        variant="ghost"
        onClick={() => setRegionPickerOpen(true)}
      >
        <MapPin className={styles.icon} size={20} />
        <span className={styles.text}>{region || "Все регионы"}</span>
      </Button>

      {showCityConfirm && detectedCity && (
        <CityConfirmPopup
          city={detectedCity}
          onConfirm={handleConfirmCity}
          onReject={handleRejectCity}
        />
      )}

      <RegionPicker
        value={region}
        onOpenChange={setRegionPickerOpen}
        onSelect={(newRegion) => setRegion(newRegion || null)}
        open={regionPickerOpen}
      />
    </div>
  );
};
