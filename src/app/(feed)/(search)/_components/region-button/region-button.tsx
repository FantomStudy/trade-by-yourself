"use client";

import { MapPin } from "lucide-react";
import { parseAsString, useQueryState } from "nuqs";
import { useState } from "react";

import { Button } from "@/app/(feed)/(search)/_lib/ui/button";

import { RegionPicker } from "../region-picker";

import styles from "./region-button.module.css";

export const RegionButton = () => {
  const [region, setRegion] = useQueryState("region", parseAsString);
  const [regionPickerOpen, setRegionPickerOpen] = useState(false);

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
        <span className={styles.text}>{region || "Весь регион"}</span>
      </Button>
      <RegionPicker
        value={region}
        onOpenChange={setRegionPickerOpen}
        onSelect={(newRegion) => setRegion(newRegion || null)}
        open={regionPickerOpen}
      />
    </div>
  );
};
