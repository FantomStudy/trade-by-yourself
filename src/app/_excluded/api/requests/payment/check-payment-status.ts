import { api } from "@/api/instance";

export interface CheckPaymentStatusDto {
  paymentId: string;
}

export interface CheckPaymentStatusResponse {
  status: string;
  amount: number;
  orderId: string;
}

export const checkPaymentStatus = async (data: CheckPaymentStatusDto) =>
  api<CheckPaymentStatusResponse>("/payment/check-status", {
    method: "POST",
    body: JSON.stringify(data),
  });
