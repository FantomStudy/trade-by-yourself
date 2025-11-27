import { api } from "../../instance";

export interface ValidateAddressRequest {
  address: string;
  addressDetails?: Record<string, any>;
}

export interface ValidateAddressResponse {
  valid: boolean;
  message?: string;
}

export const validateAddress = async (
  data: ValidateAddressRequest,
): Promise<ValidateAddressResponse> => {
  return api<ValidateAddressResponse>("/address/validate", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
};
