import { Suspense } from "react";

import { FavoritesFeed } from "./_components/favorites-feed";

const FavoritesPage = () => {
  return (
    <Suspense fallback={<div>Загрузка избранного...</div>}>
      <FavoritesFeed />
    </Suspense>
  );
};

export default FavoritesPage;
