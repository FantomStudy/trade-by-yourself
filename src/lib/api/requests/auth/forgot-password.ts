export interface ForgotPasswordRequest {
  email: string;
}

export const forgotPassword = async (
  data: ForgotPasswordRequest
): Promise<{ message: string }> => {
  const response = await fetch("http://localhost:3000/auth/forgot-password", {
    body: JSON.stringify(data),
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
  });

  return response.json();
};
