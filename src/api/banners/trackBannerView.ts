import { api } from "../instance";

export const trackBannerView = (bannerId: number) =>
  api(`/banner/${bannerId}/view`, { method: "POST", keepalive: true });
