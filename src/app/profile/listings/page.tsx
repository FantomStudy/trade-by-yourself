import { cn } from "@/utils";
import styles from "./page.module.css";
import { mock } from "@/app/mock";
import { ProductCard } from "@/components/ui";

const ListingsPage = () => {
  return (
    <div>
      <h3 className={cn("pageTitle", styles.title)}>Мои объявления</h3>

      <div className="listingGrid">
        {mock.map((listing) => (
          <ProductCard
            key={listing.id}
            title={listing.title}
            price={listing.price}
            meta={listing.meta}
            imageUrl={listing.imageUrl}
          />
        ))}
      </div>
    </div>
  );
};

export default ListingsPage;
