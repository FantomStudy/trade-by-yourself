import { Suspense } from "react";
import { FavoritesBanner } from "@/components/product-feed-banner";
import { CatalogToolbar } from "./_components/CatalogToolbar";

const Layout = ({ children }: LayoutProps<"/">) => {
  return (
    <>
      <FavoritesBanner />
      <main className="global-container">
        <Suspense>
          <CatalogToolbar />
        </Suspense>

        {children}
      </main>
    </>
  );
};

export default Layout;
