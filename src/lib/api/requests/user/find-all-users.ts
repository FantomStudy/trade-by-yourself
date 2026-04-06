import type { User } from "@/types";

import { api } from "@/api/instance";

export const findAllUsers = async () => api<User[]>("/user/find-all");
