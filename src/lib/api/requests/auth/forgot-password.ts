import { api } from "../../instance";

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  message: string;
}

export const forgotPassword = async (data: ForgotPasswordRequest) => {
  return api
    .post<ForgotPasswordResponse>("/auth/forgot-password", data)
    .then((r) => r.data);
};
