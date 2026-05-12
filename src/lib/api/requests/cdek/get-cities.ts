import type { CdekCity } from "@/types";

import { api } from "@/api/instance";

export const getCdekCities = async (city: string, limit = 10) =>
  api<CdekCity[]>(`/cdek/cities?city=${encodeURIComponent(city)}&limit=${limit}`);
