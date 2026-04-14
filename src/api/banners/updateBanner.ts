import type { BannerContent } from "./types";
import { api } from "../instance";

export const updateBanner = (id: number, body: Partial<BannerContent>) => {
  const formData = new FormData();

  if (body.image) {
    formData.append("image", body.image);
  }
  if (body.place) {
    formData.append("place", body.place);
  }
  if (body.name) {
    formData.append("name", body.name);
  }
  if (body.navigateToUrl) {
    formData.append("navigateToUrl", body.navigateToUrl);
  }

  return api(`/banner/${id}`, { method: "PUT", body: formData });
};
