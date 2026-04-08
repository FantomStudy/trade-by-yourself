import { getUserProducts } from "@/api/products";
import { LikeButton } from "@/components/LikeButton";
import { ProductCard } from "@/components/ProductCard";
import { Grid, Typography } from "@/components/ui";
import styles from "./page.module.css";

const SellerPage = async ({ params }: PageProps<"/seller/[userId]">) => {
  const { userId } = await params;
  const products = await getUserProducts(Number(userId));

  return (
    <div className="global-container">
      <div className={styles.container}>
        <aside className={styles.aside}></aside>

        <div className={styles.content}>
          <Typography className={styles.title} variant="h1">
            Всего объявлений: {products.length}
          </Typography>

          <Grid>
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                action={<LikeButton initLiked={product.isFavorited} productId={product.id} />}
              />
            ))}
          </Grid>
        </div>
      </div>
    </div>
  );
};

export default SellerPage;
