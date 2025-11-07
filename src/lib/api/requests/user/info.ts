import type { User } from "@/types";

import { api } from "../../instance";

export type GetMeResponse = Omit<User, "email">;

export const getCurrentUser = async () => {
  try {
    const response = await api
      .get<GetMeResponse>("/user/info")
      .then((r) => r.data);
    return response;
  } catch (error) {
    console.error("Failed to get current user:", error);
    return null;
  }
};
