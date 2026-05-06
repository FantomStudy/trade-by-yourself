import { CatalogToolbar } from "./_components/CatalogToolbar";
import { BannerSlot } from "./_components/FeedList/BannerSlot";

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
