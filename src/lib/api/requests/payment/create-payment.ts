import { api } from "@/api/instance";

export interface CreatePaymentDto {
  amount: number;
  description: string;
}

export interface CreatePaymentResponse {
  paymentId: string;
  paymentUrl: string;
  orderId: string;
  amount: number;
}

export const createPayment = async (data: CreatePaymentDto) =>
  api<CreatePaymentResponse>("/payment/create", {
    method: "POST",
    body: JSON.stringify(data),
  });
