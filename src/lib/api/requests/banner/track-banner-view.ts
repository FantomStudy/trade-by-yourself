import { api } from "@/api/instance";

export const trackBannerView = async (bannerId: number) => {
  try {
    await api(`/banner/${bannerId}/view`, {
      method: "POST",
    });
  } catch (error) {
    console.error("Failed to track banner view:", error);
  }
};
