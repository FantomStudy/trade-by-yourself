import { mock } from "@/app/mock";
import { ProductCard } from "@/shared/ui";

const ListingsPage = () => {
  return (
    <div>
      <h3 className="page-title text-blue">Мои объявления</h3>

      <div className="grid-listing">
        {mock.map((listing) => (
          <ProductCard
            key={listing.id}
            imageUrl={listing.imageUrl}
            meta={listing.meta}
            price={listing.price}
            title={listing.title}
          />
        ))}
      </div>
    </div>
  );
};

export default ListingsPage;
