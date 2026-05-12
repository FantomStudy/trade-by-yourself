import type { MyProductsTab } from "./_components/my-products-tabs";

import { Suspense } from "react";
import { MyProductsFeed } from "./_components/my-products-feed";

interface PageProps {
  searchParams?: Promise<{ tab?: string | string[] }>;
}

function resolveTab(raw: string | string[] | undefined): MyProductsTab {
  const v = Array.isArray(raw) ? raw[0] : raw;
  return v === "drafts" ? "drafts" : "active";
}

const MyProductsPage = async ({ searchParams }: PageProps) => {
  const sp = searchParams ? await searchParams : {};
  const initialTab = resolveTab(sp.tab);

  return (
    <Suspense fallback={<div>Загрузка ваших товаров...</div>}>
      <MyProductsFeed initialTab={initialTab} />
    </Suspense>
  );
};

export default MyProductsPage;
