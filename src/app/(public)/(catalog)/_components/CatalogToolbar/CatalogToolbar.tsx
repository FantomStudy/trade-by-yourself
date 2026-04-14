import { CategoryMenu } from "./CategoryMenu/CategoryMenu";
import { FilterMenu } from "./FilterMenu/FilterMenu";
import { RegionMenu } from "./RegionMenu/RegionMenu";
import { Search } from "./Search/Search";
import styles from "./CatalogToolbar.module.css";

export const CatalogToolbar = () => {
  return (
    <div className={styles.toolbar}>
      <CategoryMenu />
      <FilterMenu />
      <Search />
      <RegionMenu />
    </div>
  );
};
