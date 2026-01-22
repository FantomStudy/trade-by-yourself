import { api } from "@/api/instance";

// Трекать только 1 раз за сессию (чтобы не спамить при перерендерах)
const trackedBanners = new Set<number>();

export const trackBannerView = async (bannerId: number) => {
  if (trackedBanners.has(bannerId)) return;

  try {
    await api(`/banner/${bannerId}/view`, {
      method: "POST",
    });
    trackedBanners.add(bannerId);
  } catch (error) {
    console.error("Failed to track banner view:", error);
  }
};
