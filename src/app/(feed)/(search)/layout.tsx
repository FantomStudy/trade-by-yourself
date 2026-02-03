import { FiltersButton } from "./_components/filters-button";
import { RegionButton } from "./_components/region-button";
import { FavoritesBanner } from "@/components/product-feed-banner";
import { CategoryDialog, SearchBox } from "./_features/feed";

import styles from "./layout.module.css";

const Layout = ({ children }: LayoutProps<"/">) => {
  return (
    <>
      <FavoritesBanner />
      <div className="global-container">
        <div className={styles.search}>
          <CategoryDialog />
          <FiltersButton />
          <SearchBox />
          <RegionButton />
        </div>

        {children}
      </div>
    </>
  );
};

export default Layout;
