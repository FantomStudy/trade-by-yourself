import type { User } from "@/api/users";
import { api } from "@/api/instance";

export const findAllUsers = async () => api<User[]>("/user/find-all");
