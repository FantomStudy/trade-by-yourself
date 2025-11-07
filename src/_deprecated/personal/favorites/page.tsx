import { mock } from "@/app/mock";
import { ProductCard } from "@/features/products";

const FavoritesPage = () => {
  return (
    <div>
      <h3 className="page-title text-pink">Избранное</h3>

      <div className="grid-listing">
        {mock.map((listing) => (
          <ProductCard
            key={listing.id}
            imageUrl={listing.imageUrl}
            meta={listing.meta}
            price={listing.price}
            title={listing.name}
          />
        ))}
      </div>
    </div>
  );
};

export default FavoritesPage;
