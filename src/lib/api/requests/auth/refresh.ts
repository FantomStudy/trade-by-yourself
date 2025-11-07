import type { LoginResponse } from "./login";

import { api } from "../../instance";

export const refresh = async () => {
  return api.post<LoginResponse>("/auth/refresh").then((r) => r.data);
};
