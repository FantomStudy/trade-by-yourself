import { api } from "../../instance";

export interface LoginRequest {
  login: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  user: {
    id: number;
    email: string;
    fullName: string;
    phoneNumber: string;
    profileType: string;
  };
}

// export const login = async (data: LoginRequest): Promise<LoginResponse> => {
//   const response = await fetch("http://localhost:3000/auth/sign-in", {
//     body: JSON.stringify(data),
//     method: "POST",
//     headers: {
//       "content-type": "application/json",
//     },
//   });

//   const res = await response.json();

//   if (!response.ok) {
//     throw new Error(res);
//   }

//   return res;
// };

export const login = async (data: LoginRequest) => {
  return api.post<LoginResponse>("/auth/sign-in", data);
};
