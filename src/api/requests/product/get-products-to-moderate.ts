import type { ModerationFilter, ModerationProductsResponse } from "@/types";

import { api } from "../../instance";

export const getProductsToModerate = async (filter: ModerationFilter = "ALL", page: number = 1) =>
  api<ModerationProductsResponse>("/admin/moderation/products", {
    query: { filter, page },
  });
