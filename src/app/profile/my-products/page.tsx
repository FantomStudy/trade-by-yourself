import { Suspense } from "react";

import { MyProductsFeed } from "./_components/my-products-feed";

const MyProductsPage = () => {
  return (
    <Suspense fallback={<div>Загрузка ваших товаров...</div>}>
      <MyProductsFeed />
    </Suspense>
  );
};

export default MyProductsPage;
