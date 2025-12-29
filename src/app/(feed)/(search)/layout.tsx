import { HeroBanner } from "./_features/ad";
import { CategoryDialog, SearchBox } from "./_features/feed";
import { FiltersButton } from "./_components/filters-button";

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
        </div>

        {children}
      </div>
    </>
  );
};

export default Layout;
