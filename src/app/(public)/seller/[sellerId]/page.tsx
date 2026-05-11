import { notFound } from "next/navigation";
import { getUserProducts } from "@/api/products";
import { getUser } from "@/api/users";
import { LikeButton } from "@/components/LikeButton";
import { ProductGrid } from "@/components/ProductGrid";
import { Typography } from "@/components/ui";
import { ProductCard } from "../../(catalog)/_components/FeedList/ProductCard";
import { UserCard } from "./_components/UserCard";
import styles from "./page.module.css";

const SellerPage = async ({ params }: PageProps<"/seller/[sellerId]">) => {
  const { sellerId } = await params;
  const userId = Number(sellerId);

  if (Number.isNaN(sellerId)) notFound();

  const [user, products] = await Promise.all([
    getUser(userId).catch((error) => {
      if (error.status === 404) notFound();
      throw error;
    }),
    getUserProducts(userId),
  ]);

  return (
    <div className="global-container">
      <div className={styles.container}>
        <aside className={styles.aside}>
          <UserCard user={user} />
        </aside>

        <main className={styles.main}>
          <Typography variant="h1">Всего объявлений: {products.length}</Typography>
          <ProductGrid>
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                action={<LikeButton productId={product.id} initLiked={product.isFavorited} />}
              />
            ))}
          </ProductGrid>
        </main>
      </div>
    </div>
  );
};

export default SellerPage;
