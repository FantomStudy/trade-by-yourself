import { getFavorites } from "@/api/products";
import { LikeButton } from "@/components/LikeButton";
import { ProductCard } from "@/components/ProductCard";
import { Grid } from "@/components/ui";

const FavoritesPage = async () => {
  const favorites = await getFavorites();

  return (
    <Grid>
      {favorites.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          action={<LikeButton initLiked={product.isFavorited} productId={product.id} />}
        />
      ))}
    </Grid>
  );
};

export default FavoritesPage;
