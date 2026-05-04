export interface CreateDealRequest {
  productId: number;
  deliveryCost: number;
  cdekTariffCode: number;
  cdekTariffName?: string;
  cdekFromCityCode?: number;
  cdekToCityCode: number;
  cdekFromPvzCode?: string;
  cdekToPvzCode?: string;
}

export interface Deal {
  id: number;
  myRole: "buyer" | "seller";
  status: string;
  statusCode:
    | "CREATED"
    | "PAID"
    | "SHIPPED"
    | "DELIVERED"
    | "COMPLETED"
    | "CANCELLED"
    | "REFUNDED"
    | "DISPUTE"
    | string;
  amounts: {
    deliveryCost: number;
    platformFee: number;
    productAmount: number;
    sellerAmount: number;
    totalAmount: number;
  };
  product: {
    id: number;
    name: string;
    images: string[];
  };
  buyer: {
    id: number;
    fullName: string;
  };
  seller: {
    id: number;
    fullName: string;
  };
  cdek: {
    fromCityCode: number;
    fromPvzCode: string | null;
    orderUuid: string | null;
    tariffCode: number;
    tariffName: string | null;
    toCityCode: number;
    toPvzCode: string | null;
    trackNumber: string | null;
  };
  createdAt: string;
  updatedAt: string;
  paidAt?: string | null;
  shippedAt?: string | null;
  deliveredAt?: string | null;
  completedAt?: string | null;
  cancelledAt?: string | null;
  refundedAt?: string | null;
  payoutAt?: string | null;
  paymentId?: string | null;
  paymentUrl?: string | null;
  orderId?: string | null;
  disputeReason?: string | null;
}
