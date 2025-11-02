export interface ChangePasswordRequest {
  password: string;
  userId: number;
}

export const changePassword = async (
  data: ChangePasswordRequest
): Promise<{ message: string }> => {
  const response = await fetch("http://localhost:3000/auth/change-password", {
    body: JSON.stringify(data),
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
  });

  return response.json();
};
