import { FiltersButton } from "./_components/filters-button";
import { RegionButton } from "./_components/region-button";
import { HeroBanner } from "./_features/ad";
import { CategoryDialog, SearchBox } from "./_features/feed";

import styles from "./layout.module.css";

const Layout = ({ children }: LayoutProps<"/">) => {
  return (
    <>
      <HeroBanner />
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
