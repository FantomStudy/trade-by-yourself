import type { BannerPlace } from "@/api-lab/banners/getBanner";
import { useQuery } from "@tanstack/react-query";
import { getBanner } from "@/api-lab/banners/getBanner";

export const useBanner = (place: BannerPlace) =>
  useQuery({
    queryKey: ["banners", place],
    queryFn: () => getBanner(place),
  });
