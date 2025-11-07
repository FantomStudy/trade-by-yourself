import { FullBanner, ProductCard, SellerCard } from "@/shared/ui";
import { cn } from "@/shared/utils";

import { mock } from "../mock";

import styles from "./page.module.css";

const SellerPage = () => {
  return (
    <div className={styles.wrapper}>
      <SellerCard />

      <div className={styles.page}>
        <h3 className={cn("page-title", styles.title)}>Активные объявления</h3>

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

        <FullBanner />
      </div>
    </div>
  );
};

export default SellerPage;
