import styles from "./page.module.css";
import { cn } from "@/utils";
import { mock } from "../mock";
import { FullBanner, ProductCard, SellerCard } from "@/components/ui";

const SellerPage = () => {
  return (
    <div className={styles.wrapper}>
      <SellerCard />

      <div className={styles.page}>
        <h3 className={cn("pageTitle", styles.title)}>Активные объявления</h3>

        <div className="listingGrid">
          {mock.map((listing) => (
            <ProductCard
              key={listing.id}
              title={listing.title}
              meta={listing.meta}
              price={listing.price}
              imageUrl={listing.imageUrl}
            />
          ))}
        </div>

        <FullBanner />
      </div>
    </div>
  );
};

export default SellerPage;
