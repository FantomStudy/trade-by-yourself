import { api } from "../../instance";

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  message: string;
}

export const forgotPassword = async (data: ForgotPasswordRequest) => {
  const response = await api.post<ForgotPasswordResponse>(
    "/auth/forgot-password",
    data
  );

  return response.data;
};
