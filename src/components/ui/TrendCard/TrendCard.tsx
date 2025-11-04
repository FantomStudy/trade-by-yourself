"use client";

import React from "react";
import styles from "./TrendCard.module.css";

interface TrendCardProps {
  title: string;
  value: string | number;
  trend: number;
  trendPeriod: string;
  icon: string;
  color?:
    | "blue"
    | "green"
    | "purple"
    | "orange"
    | "pink"
    | "light-blue"
    | "yellow";
}

export const TrendCard: React.FC<TrendCardProps> = ({
  title,
  value,
  trend,
  trendPeriod,
  icon,
  color = "blue",
}) => {
  const formatTrend = (trendValue: number) => {
    const sign = trendValue >= 0 ? "+" : "";
    return `${sign}${trendValue.toFixed(1)}%`;
  };

  const getTrendIcon = (trendValue: number) => {
    return trendValue >= 0 ? "📈" : "📉";
  };

  const getTrendColor = (trendValue: number) => {
    return trendValue >= 0 ? styles.positive : styles.negative;
  };

  return (
    <div className={`${styles.card} ${styles[color]}`}>
      <div className={styles.header}>
        <div className={styles.icon}>{icon}</div>
      </div>

      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.value}>{value}</p>
        <p className={styles.period}>{trendPeriod}</p>
      </div>
    </div>
  );
};
