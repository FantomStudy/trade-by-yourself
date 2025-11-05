"use client";

import React, { useState } from "react";

import { exportAnalyticsData } from "../../utils";

import styles from "./ExportButton.module.css";

interface ExportButtonProps {
  className?: string;
  period: string;
}

export const ExportButton: React.FC<ExportButtonProps> = ({
  period,
  className = "",
}) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const blob = await exportAnalyticsData(period);

      // Создаем ссылку для скачивания
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `analytics-${period}-${
        new Date().toISOString().split("T")[0]
      }.csv`;
      document.body.appendChild(a);
      a.click();

      // Очищаем память
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Ошибка экспорта:", error);
      alert("Ошибка при экспорте данных");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      className={`${styles.exportButton} ${className}`}
      disabled={isExporting}
      onClick={handleExport}
    >
      {isExporting ? (
        <>
          <span className={styles.spinner}></span>
          Экспорт...
        </>
      ) : (
        <>📊 Экспорт CSV</>
      )}
    </button>
  );
};
