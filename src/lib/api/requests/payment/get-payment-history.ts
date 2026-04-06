import { api } from "@/api/instance";

export interface Payment {
  id: number;
  orderId: string;
  paymentId: string;
  userId: number;
  amount: number;
  status: "PENDING" | "COMPLETED" | "FAILED" | "CONFIRMED";
  paymentUrl: string;
  createdAt: string;
  updatedAt: string;
}

export const getPaymentHistory = async () => api<Payment[]>("/payment/history");
