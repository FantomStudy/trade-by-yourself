export interface Payment {
  id: number;
  amount: number;
  createdAt: string;
  orderId: string;
  paymentId: string;
  paymentUrl: string;
  status: "COMPLETED" | "CONFIRMED" | "FAILED" | "PENDING";
  updatedAt: string;
  userId: number;
}

export interface CreatePaymentDto {
  amount: number;
  description: string;
}

export interface CreatePaymentResponse {
  amount: number;
  orderId: string;
  paymentId: string;
  paymentUrl: string;
}

export interface CheckPaymentStatusDto {
  paymentId: string;
}

export interface CheckPaymentStatusResponse {
  amount: number;
  orderId: string;
  status: string;
}
