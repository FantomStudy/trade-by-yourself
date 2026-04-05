import type { ModerationProductDetail } from "@/types";

import { api } from "../../instance";

export const getModerationProduct = async (id: number) =>
  api<ModerationProductDetail>(`/admin/moderation/products/${id}`);
