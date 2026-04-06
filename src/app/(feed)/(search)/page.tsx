import { Suspense } from "react";

import { ProductFeed } from "./_features/feed";

export const dynamic = "force-dynamic";

const Page = () => {
  return (
    <Suspense fallback={<div>Загрузка...</div>}>
      <ProductFeed />
    </Suspense>
  );
};

export default Page;
