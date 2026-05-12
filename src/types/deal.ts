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

/** Ответ бэка на GET /deals/:id/cdek-qr — для показа QR в ПВЗ. */
export interface DealCdekQrResponse {
  qrCodeData?: string | null;
  qrCodeUrl?: string | null;
  trackNumber?: string | null;
  trackingUrl?: string | null;
  orderUuid?: string | null;
  trackPending?: boolean;
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
    /** Ссылка на трекинг cdek.ru, если трек уже есть. */
    trackingUrl?: string | null;
    /** Трек ещё не присвоен, но UUID заказа в CDEK уже есть. */
    trackPending?: boolean;
    /** С бэка: когда ждать UUID/трек (логика оплаты + CDEK). */
    registrationHint?: string | null;
    /** С бэка: что делать продавцу (тариф + ПВЗ без противоречий). */
    sellerHandoffHint?: string | null;
    /** Демо: без Тинькофф оплата симулируется по кнопке «Оплатить». */
    mockPaymentAvailable?: boolean;
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
