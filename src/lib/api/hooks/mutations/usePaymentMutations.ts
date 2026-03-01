import type { CheckPaymentStatusDto, CreatePaymentDto } from "@/api/requests";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { checkPaymentStatus, createPayment } from "@/api/requests";
import { CURRENT_USER_QUERY_KEY } from "@/hooks/useCurrentUser";
import { PAYMENT_HISTORY_QUERY_KEY } from "../queries/usePaymentHistory";
import { USER_INFO_QUERY_KEY } from "../queries/useUserInfo";

export const useCreatePaymentMutation = () => {
  return useMutation({
    mutationFn: (data: CreatePaymentDto) => createPayment(data),
  });
};

export const useCheckPaymentStatusMutation = (userId?: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CheckPaymentStatusDto) => checkPaymentStatus(data),
    onSuccess: (data) => {
      // Обновляем историю платежей после проверки статуса
      queryClient.invalidateQueries({ queryKey: PAYMENT_HISTORY_QUERY_KEY });

      // Если платеж подтвержден, обновляем баланс пользователя
      if (data.status === "CONFIRMED" || data.status === "COMPLETED") {
        queryClient.invalidateQueries({ queryKey: CURRENT_USER_QUERY_KEY });
        if (userId) {
          queryClient.invalidateQueries({
            queryKey: USER_INFO_QUERY_KEY(userId),
          });
        }
      }
    },
  });
};
