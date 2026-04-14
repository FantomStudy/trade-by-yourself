import { notFound } from "next/navigation";
import { getUserProducts } from "@/api/products";
import { getUser } from "@/api/users";
import { LikeButton } from "@/components/LikeButton";
import { ProductCard } from "@/components/ProductCard";
import { Grid, Typography } from "@/components/ui";
import { UserCard } from "./_components";
import styles from "./page.module.css";

const SellerPage = async ({ params }: PageProps<"/seller/[userId]">) => {
  const { userId } = await params;
  const sellerId = Number(userId);

  if (Number.isNaN(sellerId)) notFound();

  const [user, products] = await Promise.all([
    getUser(sellerId).catch((error) => {
      if (error?.status === 404) notFound();
      throw error;
    }),
    getUserProducts(sellerId),
  ]);

  return (
    <div className="container">
      <div className={styles.container}>
        <aside className={styles.aside}>
          <UserCard user={user} />
        </aside>

        <main className={styles.main}>
          <Typography variant="h1">Всего объявлений: {products.length}</Typography>
          <Grid>
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                action={<LikeButton productId={product.id} initLiked={product.isFavorited} />}
              />
            ))}
          </Grid>
        </main>
      </div>
    </div>
  );
};

export default SellerPage;
