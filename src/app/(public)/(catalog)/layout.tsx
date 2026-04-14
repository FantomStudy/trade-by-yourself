import { Suspense } from "react";
import { BannerSlot } from "@/components/BannerSlot";
import { CatalogToolbar } from "./_components/CatalogToolbar";
import styles from "./layout.module.css";

const Layout = ({ children }: LayoutProps<"/">) => {
  return (
    <main className="container">
      <div className={styles.layout}>
        <BannerSlot place="FAVORITES" />
        <Suspense>
          <CatalogToolbar />
        </Suspense>
        {children}
      </div>
    </main>
  );
};

export default Layout;
