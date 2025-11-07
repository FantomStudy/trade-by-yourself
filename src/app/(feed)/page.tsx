import { Suspense } from "react";

import { ProductsFeed } from "@/features/products";

const FeedPage = () => {
  return (
    <main>
      <div className="container">
        <Suspense fallback={<div>Загрузка...</div>}>
          <ProductsFeed />
        </Suspense>
      </div>
    </main>
  );
};

export default FeedPage;
