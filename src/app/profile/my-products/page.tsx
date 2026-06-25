import type { MyProductsTab } from "./_components/my-products-tabs";

import { Suspense } from "react";
import { categorizeMyProducts, resolveMyProductsTab } from "./_components/categorize-my-products";
import { MyProductsFeed } from "./_components/my-products-feed";

interface PageProps {
  searchParams?: Promise<{ tab?: string | string[] }>;
}

const MyProductsPage = async ({ searchParams }: PageProps) => {
  const sp = searchParams ? await searchParams : {};
  const initialTab = resolveMyProductsTab(sp.tab);

  return (
    <Suspense fallback={<div>Загрузка ваших товаров...</div>}>
      <MyProductsFeed initialTab={initialTab} />
    </Suspense>
  );
};

export default MyProductsPage;
