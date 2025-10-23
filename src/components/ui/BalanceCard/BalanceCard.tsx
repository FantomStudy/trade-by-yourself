"use client";

import React, { useState, useEffect, useCallback } from "react";
import { getUserBalance } from "@/utils";
import styles from "./BalanceCard.module.css";

interface BalanceCardProps {
  userId: string;
  onBalanceUpdate?: (balance: number) => void;
}

interface BalanceInfo {
  amount: number;
  currency: string;
  lastUpdated: string;
  pendingAmount?: number;
}

export const BalanceCard: React.FC<BalanceCardProps> = ({
  userId,
  onBalanceUpdate,
}) => {
  const [balance, setBalance] = useState<BalanceInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBalance = useCallback(async () => {
    if (!userId) return;

    setIsLoading(true);
    setError(null);

    try {
      const balanceData = await getUserBalance(userId);
      setBalance(balanceData);
      onBalanceUpdate?.(balanceData.amount);
    } catch (err) {
      console.error("Error fetching balance:", err);
      setError("Ошибка загрузки баланса");
    } finally {
      setIsLoading(false);
    }
  }, [userId, onBalanceUpdate]);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  const formatCurrency = (amount: number, currency: string = "RUB") => {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("ru-RU", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className={styles.balanceCard}>
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <span>Загрузка баланса...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.balanceCard}>
        <div className={styles.errorContainer}>
          <span className={styles.errorIcon}>⚠️</span>
          <span className={styles.errorText}>{error}</span>
          <button onClick={fetchBalance} className={styles.retryButton}>
            Повторить
          </button>
        </div>
      </div>
    );
  }

  if (!balance) return null;

  return (
    <div className={styles.balanceCard}>
      <div className={styles.balanceHeader}>
        <h3 className={styles.balanceTitle}>Текущий баланс</h3>
        <button onClick={fetchBalance} className={styles.refreshButton}>
          🔄
        </button>
      </div>

      <div className={styles.balanceAmount}>
        <span className={styles.amount}>
          {formatCurrency(balance.amount, balance.currency)}
        </span>
        {balance.pendingAmount && balance.pendingAmount > 0 && (
          <span className={styles.pendingAmount}>
            + {formatCurrency(balance.pendingAmount, balance.currency)} в
            обработке
          </span>
        )}
      </div>

      <div className={styles.balanceFooter}>
        <span className={styles.lastUpdated}>
          Обновлено: {formatDate(balance.lastUpdated)}
        </span>
      </div>
    </div>
  );
};
