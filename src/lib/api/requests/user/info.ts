import type { User } from "@/types";

import { api } from "../../instance";

export type GetMeResponse = Omit<User, "email">;

export const getMe = async () => {
  const response = await api.get<GetMeResponse>("/user/info");

  return response.data;
};
