import Link from "next/link";

import { ProductCard } from "../../../_lib/ui/product-card";
import { ProductGrid } from "../../../_lib/ui/product-grid";
import { getFavorites } from "../api";
import { LikeButton } from "./like-button";

// TODO: Добавить постраничную загрузку и обработку ошибок
export const FavoritesList = async () => {
  const favorites = await getFavorites();

  return (
    <ProductGrid>
      {favorites.map((product) => (
        <ProductCard key={product.id} product={product}>
          <Link href={`/feed/product/${product.id}`}>
            <ProductCard.Preview />
          </Link>

          <ProductCard.Content>
            <Link href={`/feed/product/${product.id}`}>
              <ProductCard.Title />
            </Link>

            <ProductCard.Address />
            <ProductCard.Price />

            <ProductCard.Actions>
              <LikeButton
                initLiked={product.isFavorited}
                productId={product.id}
              />
            </ProductCard.Actions>
          </ProductCard.Content>
        </ProductCard>
      ))}
    </ProductGrid>
  );
};
