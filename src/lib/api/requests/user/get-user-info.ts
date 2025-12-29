import type { User } from "@/types";

import { api } from "@/api/instance";

export const getUserInfo = async (userId: number) =>
  api<User>(`/user/info/${userId}`);
