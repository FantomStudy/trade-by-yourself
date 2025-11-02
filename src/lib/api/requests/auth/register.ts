export interface RegisterRequest {
  email: string;
  fullName: string;
  password: string;
  phoneNumber: string;
  profileType: string;
}

export const register = async (data: RegisterRequest) => {
  const response = await fetch("http://localhost:3000/auth/sign-up", {
    body: JSON.stringify(data),
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
  });

  return response.json();
};
