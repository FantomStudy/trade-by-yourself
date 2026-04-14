import { api } from "../instance";

export interface ValidateAddressRequest {
  address: string;
  addressDetails?: Record<string, any>;
}

export interface ValidateAddressResponse {
  message?: string;
  valid: boolean;
}

export const validateAddress = async (body: ValidateAddressRequest) =>
  api<ValidateAddressResponse>("/address/validate", { method: "POST", body: JSON.stringify(body) });
