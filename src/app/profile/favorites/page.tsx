import { getFavorites } from "@/api/favorites/getFavorites";
import { LikeButton } from "@/components/LikeButton";
import { ProductCard } from "@/components/ProductCard";

const FavoritesPage = async () => {
  const favorites = await getFavorites();

  return (
    <>
      {favorites.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          action={<LikeButton initLiked={product.isFavorited} productId={product.id} />}
        />
      ))}
    </>
  );
};

export default FavoritesPage;
