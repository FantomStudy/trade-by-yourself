import type { Banner, GetBannersParams } from "@/api/types/banner";

import { api } from "@/api/instance";

export const getBanners = async (params?: GetBannersParams) => {
  const searchParams = new URLSearchParams();

  if (params?.place) {
    searchParams.append("place", params.place);
  }

  const url = `/banner${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;

  return api<Banner[]>(url, {
    method: "GET",
  });
};
