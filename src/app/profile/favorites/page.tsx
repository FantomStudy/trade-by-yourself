import { cn } from "@/utils";
import styles from "./page.module.css";
import { mock } from "@/app/mock";
import { ProductCard } from "@/components/ui";

const FavoritesPage = () => {
  return (
    <div>
      <h3 className={cn("pageTitle", styles.title)}>Избранное</h3>

      <div className="listingGrid">
        {mock.map((listing) => (
          <ProductCard
            key={listing.id}
            imageUrl={listing.imageUrl}
            meta={listing.meta}
            title={listing.title}
            price={listing.price}
          />
        ))}
      </div>
    </div>
  );
};

export default FavoritesPage;
