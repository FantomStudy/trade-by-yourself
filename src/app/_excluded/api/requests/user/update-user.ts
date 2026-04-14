import { api } from "@/api/instance";

export interface UpdateUserDto {
  balance?: number;
  bonusBalance?: number;
  email?: string;
  fullName?: string;
  phoneNumber?: string;
  profileType?: string;
}

export const updateUser = async (id: number, data: UpdateUserDto) =>
  api(`/user/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
