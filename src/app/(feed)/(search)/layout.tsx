import { Suspense } from "react";
import { FavoritesBanner } from "@/components/product-feed-banner";
import { FiltersButton } from "./_components/filters-button";
import { RegionButton } from "./_components/region-button";
import { CategoryDialog, SearchBox } from "./_features/feed";
import styles from "./layout.module.css";

const Layout = ({ children }: LayoutProps<"/">) => {
  return (
    <>
      <FavoritesBanner />
      <div className="global-container">
        <Suspense>
          <div className={styles.search}>
            <CategoryDialog />
            <FiltersButton />
            <SearchBox />
            <RegionButton />
          </div>
        </Suspense>

        {children}
      </div>
    </>
  );
};

export default Layout;
