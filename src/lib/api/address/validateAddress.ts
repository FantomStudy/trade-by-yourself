import { api } from "../instance";

interface ValidateAddressData {
  address: string;
  addressDetails?: Record<string, any>;
}

export interface ValidateAddressResponse {
  message?: string;
  valid: boolean;
}

export const validateAddress = async (data: ValidateAddressData) =>
  api<ValidateAddressResponse>("/address/validate", {
    method: "POST",
    body: data,
  });
