import type { UpdateBannerData } from "@/api/types/banner";

import { api } from "@/api/instance";

export const updateBanner = async (id: number, data: UpdateBannerData) => {
  const formData = new FormData();

  if (data.image) {
    formData.append("image", data.image);
  }

  if (data.place) {
    formData.append("place", data.place);
  }

  if (data.name) {
    formData.append("name", data.name);
  }

  if (data.navigateToUrl) {
    formData.append("navigateToUrl", data.navigateToUrl);
  }

  return api(`/banner/${id}`, {
    method: "PUT",
    body: formData,
  });
};
