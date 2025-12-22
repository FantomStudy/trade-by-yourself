import { Suspense } from "react";

import { Filters } from "./_components/filters";
import { ProductFeed } from "./_features/feed";

export const dynamic = "force-dynamic";

const Page = () => {
  return (
    <Suspense fallback={<div>Загрузка...</div>}>
      <Filters>
        <ProductFeed />
      </Filters>
    </Suspense>
  );
};

export default Page;
