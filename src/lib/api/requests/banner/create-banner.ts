import type { CreateBannerData } from "@/api/types/banner";

import { api } from "@/api/instance";

export const createBanner = async (data: CreateBannerData) => {
  const formData = new FormData();

  formData.append("image", data.image);
  formData.append("place", data.place);

  return api("/banner", {
    method: "POST",
    body: formData,
  });
};
