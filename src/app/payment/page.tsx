"use client";

import { useState } from "react";
import { Input, Button, BalanceCard } from "@/components/ui";
import styles from "./page.module.css";

interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
  commission: number;
  selected: boolean;
}

interface Transaction {
  id: string;
  amount: string;
  operationNumber: string;
  account: string;
  dateTime: string;
}

const Payment = () => {
  const [amount, setAmount] = useState("");
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: "card",
      name: "CREDIT CARD",
      icon: "💳",
      commission: 0,
      selected: true,
    },
    {
      id: "sbp",
      name: "СБП",
      icon: "🏦",
      commission: 0,
      selected: false,
    },
    {
      id: "yomoney",
      name: "ЮMoney",
      icon: "💰",
      commission: 0,
      selected: false,
    },
  ]);

  const [transactions] = useState<Transaction[]>([
    {
      id: "1",
      amount: "3000 рублей",
      operationNumber: "klrr671kr_290kss",
      account: "034304434455456",
      dateTime: "12.10.24 12:34",
    },
    {
      id: "2",
      amount: "3000 рублей",
      operationNumber: "klrr671kr_290kss",
      account: "034304434455456",
      dateTime: "12.10.24 12:34",
    },
    {
      id: "3",
      amount: "3000 рублей",
      operationNumber: "klrr671kr_290kss",
      account: "034304434455456",
      dateTime: "12.10.24 12:34",
    },
    {
      id: "4",
      amount: "3000 рублей",
      operationNumber: "klrr671kr_290kss",
      account: "034304434455456",
      dateTime: "12.10.24 12:34",
    },
    {
      id: "5",
      amount: "3000 рублей",
      operationNumber: "klrr671kr_290kss",
      account: "034304434455456",
      dateTime: "12.10.24 12:34",
    },
    {
      id: "6",
      amount: "3000 рублей",
      operationNumber: "klrr671kr_290kss",
      account: "034304434455456",
      dateTime: "12.10.24 12:34",
    },
    {
      id: "7",
      amount: "3000 рублей",
      operationNumber: "klrr671kr_290kss",
      account: "034304434455456",
      dateTime: "12.10.24 12:34",
    },
    {
      id: "8",
      amount: "3000 рублей",
      operationNumber: "klrr671kr_290kss",
      account: "034304434455456",
      dateTime: "12.10.24 12:34",
    },
    {
      id: "9",
      amount: "3000 рублей",
      operationNumber: "klrr671kr_290kss",
      account: "034304434455456",
      dateTime: "12.10.24 12:34",
    },
    {
      id: "10",
      amount: "3000 рублей",
      operationNumber: "klrr671kr_290kss",
      account: "034304434455456",
      dateTime: "12.10.24 12:34",
    },
    {
      id: "11",
      amount: "3000 рублей",
      operationNumber: "klrr671kr_290kss",
      account: "034304434455456",
      dateTime: "12.10.24 12:34",
    },
    {
      id: "12",
      amount: "3000 рублей",
      operationNumber: "klrr671kr_290kss",
      account: "034304434455456",
      dateTime: "12.10.24 12:34",
    },
  ]);

  const [isLoading, setIsLoading] = useState(false);

  const handlePaymentMethodSelect = (methodId: string) => {
    setPaymentMethods((prev) =>
      prev.map((method) => ({
        ...method,
        selected: method.id === methodId,
      }))
    );
  };

  const handleTopUp = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      alert("Введите корректную сумму");
      return;
    }

    setIsLoading(true);
    try {
      // Симуляция API запроса
      await new Promise((resolve) => setTimeout(resolve, 2000));
      alert(`Успешное пополнение на сумму ${amount} руб.`);
      setAmount("");
    } catch (error) {
      console.error("Payment error:", error);
      alert("Ошибка при пополнении");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.paymentSection}>
        <h1 className={styles.title}>Пополнение личного кабинета</h1>

        <div className={styles.amountSection}>
          <label className={styles.label}>Введите сумму пополнения</label>
          <div className={styles.amountInputContainer}>
            <Input
              type="number"
              placeholder="0 руб."
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className={styles.amountInput}
            />
            <Button
              onClick={handleTopUp}
              disabled={isLoading || !amount}
              className={styles.confirmButton}
            >
              {isLoading ? "Обработка..." : "Подтвердить"}
            </Button>
          </div>
        </div>

        <div className={styles.paymentMethodsSection}>
          <label className={styles.label}>Выберите платежную систему</label>
          <div className={styles.paymentMethods}>
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                className={`${styles.paymentMethod} ${
                  method.selected ? styles.selected : ""
                }`}
                onClick={() => handlePaymentMethodSelect(method.id)}
              >
                <div className={styles.methodContent}>
                  {method.id === "card" && (
                    <div className={styles.creditCard}>
                      <div className={styles.cardHeader}>
                        <span className={styles.cardType}>CREDIT CARD</span>
                        <div className={styles.cardChips}>
                          <div className={styles.chip}></div>
                          <div className={styles.chip}></div>
                        </div>
                      </div>
                      <div className={styles.cardNumber}>
                        <div className={styles.numberGroup}></div>
                        <div className={styles.numberGroup}></div>
                        <div className={styles.numberGroup}></div>
                        <div className={styles.numberGroup}></div>
                      </div>
                    </div>
                  )}
                  {method.id === "sbp" && (
                    <div className={styles.sbpLogo}>
                      <div className={styles.sbpIcon}>
                        <div className={styles.sbpTriangle1}></div>
                        <div className={styles.sbpTriangle2}></div>
                        <div className={styles.sbpTriangle3}></div>
                      </div>
                      <span className={styles.sbpText}>сбп</span>
                    </div>
                  )}
                  {method.id === "yomoney" && (
                    <div className={styles.yomoneyLogo}>
                      <div className={styles.yomoneyIcon}>
                        <span className={styles.yoText}>YO</span>
                      </div>
                      <span className={styles.moneyText}>money</span>
                    </div>
                  )}
                </div>
                <div className={styles.commission}>
                  Комиссия- {method.commission}%
                </div>
                {method.selected && <div className={styles.checkmark}>✓</div>}
              </div>
            ))}
          </div>

          <Button
            onClick={handleTopUp}
            disabled={isLoading || !amount}
            className={styles.topupButton}
          >
            {isLoading ? "Обработка..." : "Пополнить"}
          </Button>
        </div>
      </div>

      <div className={styles.historySection}>
        <h2 className={styles.historyTitle}>История пополнений</h2>
        <div className={styles.transactionsList}>
          <div className={styles.transactionHeader}>
            <span>Сумма пополнения</span>
            <span>Номер операции</span>
            <span>Счет</span>
            <span>Время и дата</span>
          </div>
          {transactions.map((transaction) => (
            <div key={transaction.id} className={styles.transaction}>
              <span className={styles.transactionAmount}>
                {transaction.amount}
              </span>
              <span className={styles.transactionOperation}>
                {transaction.operationNumber}
              </span>
              <span className={styles.transactionAccount}>
                {transaction.account}
              </span>
              <span className={styles.transactionDate}>
                {transaction.dateTime}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Payment;
