"use client";

import {
  ArrowDownLeft,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  CreditCard,
  RefreshCw,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import {
  useCheckPaymentStatusMutation,
  useCreatePaymentMutation,
  usePaymentHistory,
} from "@/api/hooks";
import { Button, Input, Typography } from "@/components/ui";
import { useAuth } from "@/lib/contexts";

import styles from "./page.module.css";

const BalancePage = () => {
  const { user } = useAuth();
  const [amount, setAmount] = useState("");
  const { data: payments = [], isLoading, refetch } = usePaymentHistory();
  const createPaymentMutation = useCreatePaymentMutation();
  const checkStatusMutation = useCheckPaymentStatusMutation();

  // Автоматическая проверка pending платежей каждые 30 секунд
  useEffect(() => {
    const interval = setInterval(() => {
      const hasPendingPayments = payments.some((p) => p.status === "PENDING");
      if (hasPendingPayments) {
        refetch();
      }
    }, 30000); // 30 секунд

    return () => clearInterval(interval);
  }, [payments, refetch]);

  const handleAmountClick = (value: number) => {
    setAmount(value.toString());
  };

  const handleTopUp = async () => {
    const numAmount = Number(amount);

    if (!amount || numAmount <= 0) {
      toast.error("Введите корректную сумму");
      return;
    }

    if (numAmount < 100) {
      toast.error("Минимальная сумма пополнения 100₽");
      return;
    }

    try {
      const result = await createPaymentMutation.mutateAsync({
        amount: numAmount,
        description: `Пополнение баланса на сумму ${numAmount}₽`,
      });

      // Открываем ссылку на оплату в новой вкладке
      window.open(result.paymentUrl, "_blank");
      toast.success("Перенаправление на страницу оплаты...");
      setAmount("");
    } catch {
      toast.error("Ошибка при создании платежа");
    }
  };

  const handleCheckStatus = async (paymentId: string) => {
    try {
      const result = await checkStatusMutation.mutateAsync({ paymentId });
      if (result.status === "CONFIRMED" || result.status === "COMPLETED") {
        toast.success("Платеж успешно завершен");
      } else if (result.status === "PENDING") {
        toast.info("Платеж в обработке");
      } else {
        toast.error("Платеж отклонен");
      }
    } catch {
      toast.error("Ошибка при проверке статуса");
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "COMPLETED":
      case "CONFIRMED":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "PENDING":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case "FAILED":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "COMPLETED":
      case "CONFIRMED":
        return "Завершен";
      case "PENDING":
        return "В обработке";
      case "FAILED":
        return "Отклонен";
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className={styles.page}>
      <div className={styles["balance-card"]}>
        <div className={styles["balance-decoration-top"]} />
        <div className={styles["balance-decoration-bottom"]} />

        <div className={styles["balance-content"]}>
          <Typography className={styles["balance-label"]}>
            Текущий баланс
          </Typography>
          <Typography className={styles["balance-amount"]}>
            {user?.balance?.toFixed(2) || "0.00"} ₽
          </Typography>

          <div className={styles["balance-info"]}>
            <CreditCard />
            <span>Доступно для использования</span>
          </div>
        </div>
      </div>

      {/* Форма пополнения */}
      <div className={styles["form-card"]}>
        <Typography className={styles["form-title"]} variant="h2">
          Пополнить баланс
        </Typography>

        <div className={styles["form-content"]}>
          <div>
            <label
              className="mb-2 block text-sm font-medium text-gray-700"
              htmlFor="amount-input"
            >
              Сумма пополнения
            </label>
            <Input
              id="amount-input"
              min="100"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Введите сумму"
            />
          </div>

          {/* Быстрый выбор суммы */}
          <div>
            <Typography className="mb-2 text-sm font-medium text-gray-700">
              Быстрый выбор
            </Typography>
            <div className={styles["quick-amounts"]}>
              {[500, 1000, 2000, 5000].map((value) => (
                <Button
                  key={value}
                  className={styles["quick-amount-btn"]}
                  variant="secondary"
                  onClick={() => handleAmountClick(value)}
                >
                  {value} ₽
                </Button>
              ))}
            </div>
          </div>

          <Button
            className="w-full"
            disabled={createPaymentMutation.isPending || !amount}
            onClick={handleTopUp}
          >
            {createPaymentMutation.isPending ? (
              "Создание платежа..."
            ) : (
              <>
                <ArrowUpRight className="mr-2 h-5 w-5" />
                Пополнить через Т-Банк
              </>
            )}
          </Button>

          <Typography className={styles["form-hint"]}>
            Минимальная сумма пополнения: 100₽. После нажатия кнопки вы будете
            перенаправлены на безопасную страницу оплаты Т-Банка.
          </Typography>
        </div>
      </div>

      {/* История операций */}
      <div className={styles["history-card"]}>
        <div className={styles["history-header"]}>
          <Typography className={styles["history-title"]} variant="h2">
            История операций
          </Typography>
          <Button
            disabled={isLoading}
            variant="secondary"
            onClick={() => refetch()}
          >
            <RefreshCw
              className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
            />
          </Button>
        </div>

        {isLoading ? (
          <div className={styles.loading}>
            <div className={styles.spinner} />
          </div>
        ) : payments.length === 0 ? (
          <div className={styles["empty-state"]}>
            <div className={styles["empty-icon"]}>
              <ArrowDownLeft />
            </div>
            <Typography className={styles["empty-title"]}>
              История пуста
            </Typography>
            <Typography className={styles["empty-description"]}>
              Здесь будут отображаться ваши транзакции
            </Typography>
          </div>
        ) : (
          <div className={styles["history-list"]}>
            {payments.map((payment) => (
              <div key={payment.id} className={styles["payment-item"]}>
                <div className={styles["payment-left"]}>
                  <div className={styles["payment-icon"]}>
                    {getStatusIcon(payment.status)}
                  </div>
                  <div className={styles["payment-info"]}>
                    <div className={styles["payment-header"]}>
                      <Typography className={styles["payment-title"]}>
                        Пополнение баланса
                      </Typography>
                      <span
                        className={`${styles["payment-status"]} ${
                          payment.status === "COMPLETED" ||
                          payment.status === "CONFIRMED"
                            ? styles["payment-status-success"]
                            : payment.status === "PENDING"
                              ? styles["payment-status-pending"]
                              : styles["payment-status-failed"]
                        }`}
                      >
                        {getStatusText(payment.status)}
                      </span>
                    </div>
                    <Typography className={styles["payment-date"]}>
                      {formatDate(payment.createdAt)}
                    </Typography>
                    <Typography className={styles["payment-order-id"]}>
                      ID заказа: {payment.orderId}
                    </Typography>
                  </div>
                </div>

                <div className={styles["payment-right"]}>
                  <Typography className={styles["payment-amount"]}>
                    +{payment.amount} ₽
                  </Typography>
                  {payment.status === "PENDING" && (
                    <Button
                      disabled={checkStatusMutation.isPending}
                      variant="secondary"
                      onClick={() => handleCheckStatus(payment.paymentId)}
                    >
                      {checkStatusMutation.isPending
                        ? "Проверка..."
                        : "Проверить"}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BalancePage;
