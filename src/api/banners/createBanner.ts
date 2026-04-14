import type { BannerContent } from "./types";
import { api } from "../instance";

export const createBanner = async (body: BannerContent) => {
  const formData = new FormData();

  formData.append("image", body.image);
  formData.append("place", body.place);
  formData.append("name", body.name);
  formData.append("navigateToUrl", body.navigateToUrl);

  return api("/banner", { method: "POST", body: formData });
};
