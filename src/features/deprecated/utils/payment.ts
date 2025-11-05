export interface PaymentMethod {
  id: string;
  name: string;
  available: boolean;
  commission: number;
  icon: string;
}

export interface TopUpRequest {
  amount: number;
  paymentMethodId: string;
  userId: string;
}

export interface Transaction {
  id: string;
  account: string;
  amount: number;
  currency: string;
  dateTime: string;
  operationNumber: string;
  paymentMethod: string;
  status: "completed" | "failed" | "pending";
}

export interface TopUpResponse {
  message: string;
  paymentUrl?: string;
  success: boolean;
  transactionId: string;
}

/**
 * Получить доступные методы пополнения
 *
 * @returns Promise с массивом доступных платежных методов
 */
export const getPaymentMethods = async (): Promise<PaymentMethod[]> => {
  const response = await fetch("/api/payment/methods", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || "Ошибка при загрузке платежных методов"
    );
  }

  return response.json();
};

/**
 * Инициировать пополнение баланса
 *
 * @param data - Данные для пополнения (сумма, метод оплаты, ID пользователя)
 * @returns Promise с результатом операции пополнения
 */
export const topUpBalance = async (
  data: TopUpRequest
): Promise<TopUpResponse> => {
  const response = await fetch("/api/payment/topup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Ошибка при пополнении баланса");
  }

  return response.json();
};

/**
 * Получить историю пополнений пользователя
 *
 * @param userId - ID пользователя
 * @param limit - Лимит записей (по умолчанию 50)
 * @param offset - Смещение для пагинации (по умолчанию 0)
 * @returns Promise с массивом транзакций
 */
export const getTransactionHistory = async (
  userId: string,
  limit: number = 50,
  offset: number = 0
): Promise<Transaction[]> => {
  const params = new URLSearchParams({
    userId,
    limit: limit.toString(),
    offset: offset.toString(),
  });

  const response = await fetch(`/api/payment/history?${params}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || "Ошибка при загрузке истории транзакций"
    );
  }

  return response.json();
};

/**
 * Проверить статус транзакции
 *
 * @param transactionId - ID транзакции
 * @returns Promise со статусом транзакции
 */
export const checkTransactionStatus = async (transactionId: string) => {
  const response = await fetch(`/api/payment/status/${transactionId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || "Ошибка при проверке статуса транзакции"
    );
  }

  return response.json();
};

/**
 * Получить текущий баланс пользователя
 *
 * @param userId - ID пользователя
 * @returns Promise с информацией о балансе
 */
export const getUserBalance = async (userId: string) => {
  const response = await fetch(`/api/user/${userId}/balance`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Ошибка при получении баланса");
  }

  return response.json();
};

/**
 * Отменить транзакцию (если возможно)
 *
 * @param transactionId - ID транзакции
 * @returns Promise с результатом отмены
 */
export const cancelTransaction = async (transactionId: string) => {
  const response = await fetch(`/api/payment/cancel/${transactionId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Ошибка при отмене транзакции");
  }

  return response.json();
};
