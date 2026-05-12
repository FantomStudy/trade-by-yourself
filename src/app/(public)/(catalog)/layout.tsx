import { BannerSlot } from "@/components/BannerSlot";
import { CatalogToolbar } from "./_components/CatalogToolbar";

const CatalogLayout = ({ children }: LayoutProps<"/">) => {
  return (
    <div className="global-container" style={{ marginTop: "-16px" }}>
      <BannerSlot place="FAVORITES" />
      <CatalogToolbar />

      {children}
    </div>
  );
};

export default CatalogLayout;
