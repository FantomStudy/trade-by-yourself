import type { LoginResponse } from "./login";

export const refresh = async (): Promise<LoginResponse> => {
  const response = await fetch("http://localhost:3000/auth/refresh", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
  });

  return response.json();
};
