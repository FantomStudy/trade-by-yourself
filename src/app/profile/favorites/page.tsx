import { Suspense } from "react";

import { FavoritesFeed } from "./_components";

const FavoritesPage = () => {
  return (
    <div>
      <Suspense fallback={<div>Загрузка избранного...</div>}>
        <FavoritesFeed />
      </Suspense>
    </div>
  );
};

export default FavoritesPage;
