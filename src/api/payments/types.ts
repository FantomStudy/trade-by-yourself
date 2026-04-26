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

export interface CheckPaymentStatusDto {
  paymentId: string;
}

export interface CheckPaymentStatusResponse {
  status: string;
  amount: number;
  orderId: string;
}
