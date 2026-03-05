import type { BannerPlace } from "@/api-lab/banners/getBanner";
import { useBanner } from "@/hooks/useBanner";
import styles from "./BannerSlot.module.css";

interface BannerSlotProps {
  place: BannerPlace;
}

export const BannerSlot = ({ place }: BannerSlotProps) => {
  const banner = useBanner(place);

  return <div>BannerSlot</div>;
};
