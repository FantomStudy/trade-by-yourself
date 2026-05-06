import { Suspense } from "react";
import { CategoryMenu } from "./CategoryMenu/CategoryMenu";
import { FilterMenu } from "./FilterMenu/FilterMenu";
import { RegionMenu } from "./RegionMenu/RegionMenu";
import { Search } from "./Search/Search";
import styles from "./CatalogToolbar.module.css";

export const CatalogToolbar = () => {
  return (
    <div className={styles.toolbar}>
      <Suspense>
        <CategoryMenu />
        <FilterMenu />
        <Search />
        <RegionMenu />
      </Suspense>
    </div>
  );
};
