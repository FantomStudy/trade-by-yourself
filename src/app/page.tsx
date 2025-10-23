import styles from "./page.module.css";
import { mock } from "../app/mock";
import { FullBanner, ProductCard } from "@/components/ui";

const Home = () => {
  return (
    <>
      <h3 className="pageTitle">Рекомендованные объявления</h3>
      <div className={styles.grid}>
        {mock.map((listing) => (
          <ProductCard
            key={listing.id}
            imageUrl={listing.imageUrl}
            title={listing.title}
            meta={listing.meta}
            price={listing.price}
          />
        ))}
      </div>
      <FullBanner />
    </>
  );
};

export default Home;
