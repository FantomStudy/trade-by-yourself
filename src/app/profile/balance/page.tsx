"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import {
  ArrowDownLeft,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  CreditCard,
  RefreshCw,
  XCircle,
} from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { createPayment, getPaymentHistory } from "@/api/payments";
import { getUser } from "@/api/users";
import { Button, Field, Input, Typography } from "@/components/ui";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import styles from "./page.module.css";

const STATUS_TYPE = {
  COMPLETED: { text: "Завершен", icon: <CheckCircle2 className={styles.statusIconSuccess} /> },
  CONFIRMED: { text: "Завершен", icon: <CheckCircle2 className={styles.statusIconSuccess} /> },
  PENDING: { text: "В обработке", icon: <Clock className={styles.statusIconPending} /> },
  FAILED: { text: "Отклонен", icon: <XCircle className={styles.statusIconFailed} /> },
} as const;

interface FormValues {
  amount: string;
}

const schema = z.object({
  amount: z
    .string()
    .refine((value) => value && !Number.isNaN(Number(value)), "Введите коректную цену")
    .refine((value) => Number(value) > 0, "Цена должна быть больше 0"),
});

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const BalancePage = () => {
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onBlur",
    defaultValues: {
      amount: "",
    },
  });

  const { data: user } = useCurrentUser();
  const { data: userInfo } = useQuery({
    queryKey: ["user", "info", user?.id],
    queryFn: () => getUser(user!.id),
    enabled: Number(user?.id) > 0,
  });

  const {
    data: payments = [],
    isLoading,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["payments", "history"],
    queryFn: getPaymentHistory,
  });
  const createPaymentMutation = useMutation({ mutationFn: createPayment });

  // Автоматическая проверка pending платежей каждые 30 секунд
  useEffect(() => {
    const interval = setInterval(
      () => payments.some((p) => p.status === "PENDING") && refetch(),
      1000 * 30,
    );

    return () => clearInterval(interval);
  }, [payments, refetch]);

  const onSubmit = handleSubmit(async (data: FormValues) => {
    const numAmount = Number(data.amount);

    try {
      const result = await createPaymentMutation.mutateAsync({
        amount: numAmount,
        description: `Пополнение баланса на сумму ${numAmount}₽`,
      });

      // Открываем ссылку на оплату в новой вкладке
      window.open(result.paymentUrl, "_blank");
      toast.success("Перенаправление на страницу оплаты...");
      setValue("amount", "");
    } catch (error) {
      console.error("Error creating payment:", error);
      toast.error("Ошибка при создании платежа");
    }
  });

  return (
    <div className={styles.page}>
      <div className={styles.balanceCard}>
        <div className={styles.balanceDecorationTop} />
        <div className={styles.balanceDecorationBottom} />

        <div className={styles.balanceContent}>
          <Typography className={styles.balanceLabel}>Текущий баланс</Typography>
          <Typography className={styles.balanceAmount}>
            {userInfo?.balance?.toFixed(2) || "0.00"} ₽
          </Typography>

          <div className={styles.balanceInfo}>
            <CreditCard />
            <span>Доступно для использования</span>
          </div>
        </div>
      </div>

      {/* Форма пополнения */}
      <div className={styles.formCard}>
        <Typography className={styles.formTitle} variant="h2">
          Пополнить баланс
        </Typography>

        <div className={styles.formContent}>
          <Field>
            <Field.Label htmlFor="amount-input">Сумма пополнения</Field.Label>
            <Input
              id="amount-input"
              min="1"
              type="number"
              {...register("amount")}
              placeholder="Введите сумму"
            />
            <Field.Error className={styles.errorText}>{errors.amount?.message}</Field.Error>
          </Field>

          {/* Быстрый выбор суммы */}
          <Field>
            <Field.Label>Быстрый выбор</Field.Label>
            <div className={styles.quickAmounts}>
              {["500", "1000", "2000", "5000"].map((value) => (
                <Button
                  key={value}
                  className={styles.quickAmountBtn}
                  variant="success"
                  onClick={() => setValue("amount", value, { shouldValidate: true })}
                >
                  {value} ₽
                </Button>
              ))}
            </div>
          </Field>

          <Button
            className={styles.topUpButton}
            disabled={createPaymentMutation.isPending}
            onClick={onSubmit}
          >
            {createPaymentMutation.isPending ? (
              "Создание платежа..."
            ) : (
              <>
                <ArrowUpRight className={styles.topUpIcon} />
                Пополнить
              </>
            )}
          </Button>

          <Typography className={styles.formHint}>
            Минимальная сумма пополнения: 100₽. После нажатия кнопки вы будете перенаправлены на
            безопасную страницу оплаты Т-Банка.
          </Typography>
        </div>
      </div>

      {/* История операций */}
      <div className={styles.historyCard}>
        <div className={styles.historyHeader}>
          <Typography className={styles.historyTitle} variant="h2">
            История операций
          </Typography>
          <Button disabled={isRefetching} variant="success" onClick={() => refetch()}>
            <RefreshCw
              className={clsx(styles.refreshIcon, isRefetching && styles.refreshIconSpinning)}
            />
          </Button>
        </div>

        {isLoading ? (
          <div className={styles.loading}>
            <div className={styles.spinner} />
          </div>
        ) : payments.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              <ArrowDownLeft />
            </div>
            <Typography className={styles.emptyTitle}>История пуста</Typography>
            <Typography className={styles.emptyDescription}>
              Здесь будут отображаться ваши транзакции
            </Typography>
          </div>
        ) : (
          <div className={styles.historyList}>
            {payments.map((payment) => (
              <div key={payment.id} className={styles.paymentItem}>
                <div className={styles.paymentLeft}>
                  <div className={styles.paymentIcon}>{STATUS_TYPE[payment.status].icon}</div>
                  <div className={styles.paymentInfo}>
                    <div className={styles.paymentHeader}>
                      <Typography className={styles.paymentTitle}>Пополнение баланса</Typography>
                      <span
                        className={`${styles.paymentStatus} ${
                          payment.status === "COMPLETED" || payment.status === "CONFIRMED"
                            ? styles.paymentStatusSuccess
                            : payment.status === "PENDING"
                              ? styles.paymentStatusPending
                              : styles.paymentStatusFailed
                        }`}
                      >
                        {STATUS_TYPE[payment.status].text}
                      </span>
                    </div>
                    <Typography className={styles.paymentDate}>
                      {formatDate(payment.createdAt)}
                    </Typography>
                    <Typography className={styles.paymentOrderId}>
                      ID заказа: {payment.orderId}
                    </Typography>
                  </div>
                </div>

                <Typography className={styles.paymentAmount}>+{payment.amount} ₽</Typography>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BalancePage;
