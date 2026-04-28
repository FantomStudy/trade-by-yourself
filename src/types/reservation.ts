export interface Reservation {
  id: number;
  status: string;
  myRole?: "buyer" | "seller";
  createdAt: string;
  updatedAt: string;
  hours?: number;
  extendedOnce?: boolean;
  expiresAt?: string | null;
  reservedUntil?: string | null;
  note?: string | null;
  cancelReason?: string | null;
  product?: {
    id: number;
    name: string;
    images: string[];
  };
  buyer?: {
    id: number;
    fullName: string;
  };
  seller?: {
    id: number;
    fullName: string;
  };
  productId?: number;
  productName?: string;
  buyerId?: number;
  buyerName?: string;
  sellerId?: number;
  sellerName?: string;
  cancelledAt?: string | null;
}

export interface ProductReservationInfo {
  isReserved: boolean;
  reservation?: Reservation | null;
  reservedUntil?: string | null;
  expiresAt?: string | null;
}

export interface CreateReservationRequest {
  productId: number;
  hours?: number;
  note?: string;
}

export interface UpdateReservationProductSettingsRequest {
  productId: number;
  allowReservations: boolean;
  reservationHours: number;
}
