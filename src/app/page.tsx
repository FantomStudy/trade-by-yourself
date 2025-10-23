import { FullBanner, ProductCard } from "@/shared/ui";

import { mock } from "../app/mock";

import styles from "./page.module.css";

const Home = () => {
  return (
    <>
      <h3 className="page-title">Рекомендованные объявления</h3>
      <div className={styles.grid}>
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
    </>
  );
};

export default Home;
