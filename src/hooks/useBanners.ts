import type { BannerPlace } from "@/api/banners/types";
import { useQuery } from "@tanstack/react-query";
import { getBanners } from "@/api/banners/getBanners";

export const useBanners = (query?: { place: BannerPlace }) =>
  useQuery({
    queryKey: ["banners", query],
    queryFn: () => getBanners(query),
  });
