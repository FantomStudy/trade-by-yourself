import type { Product } from "@/types";

import { api } from "@/api/instance";

export const getMyDrafts = async () => api<Product[]>("/product/my-drafts");
