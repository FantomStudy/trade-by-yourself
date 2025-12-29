import type { CheckPaymentStatusDto, CreatePaymentDto } from "@/api/requests";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { checkPaymentStatus, createPayment } from "@/api/requests";

import { CURRENT_USER_QUERY_KEY } from "../queries/useCurrentUser";
import { PAYMENT_HISTORY_QUERY_KEY } from "../queries/usePaymentHistory";

export const useCreatePaymentMutation = () => {
  return useMutation({
    mutationFn: (data: CreatePaymentDto) => createPayment(data),
  });
};

export const useCheckPaymentStatusMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CheckPaymentStatusDto) => checkPaymentStatus(data),
    onSuccess: (data) => {
      // Обновляем историю платежей после проверки статуса
      queryClient.invalidateQueries({ queryKey: PAYMENT_HISTORY_QUERY_KEY });

      // Если платеж подтвержден, обновляем баланс пользователя
      if (data.status === "CONFIRMED" || data.status === "COMPLETED") {
        queryClient.invalidateQueries({ queryKey: CURRENT_USER_QUERY_KEY });
      }
    },
  });
};
