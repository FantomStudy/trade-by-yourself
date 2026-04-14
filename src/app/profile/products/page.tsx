import { getUserProducts } from "@/api/products";
import { OwnedProductActions } from "@/components/OwnedProductActions";
import { ProductCard } from "@/components/ProductCard";
import { Grid } from "@/components/ui";
import { verifySession } from "@/lib/dal";
import styles from "./page.module.css";

const ProfileProductPage = async () => {
  const { user } = await verifySession();
  const products = await getUserProducts(user.id);

  return (
    <Grid>
      {products.map((product) => (
        <ProductCard key={product.id} product={product}>
          <OwnedProductActions
            productId={product.id}
            isHidden={product.isHide}
            variant="compact"
            className={styles.actions}
          />
        </ProductCard>
      ))}
    </Grid>
  );
};

export default ProfileProductPage;
