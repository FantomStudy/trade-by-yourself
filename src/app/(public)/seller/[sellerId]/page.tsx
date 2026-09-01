import { notFound } from "next/navigation";
import { getUserProducts } from "@/api/products";
import { getUser } from "@/api/users";
import { LikeButton } from "@/components/LikeButton";
import { ProductGrid } from "@/components/ProductGrid";
import { Typography } from "@/components/ui";
import { ProductCard } from "../../../../components/ProductCard";
import { UserCard } from "./_components/UserCard";
import styles from "./page.module.css";

const SellerPage = async ({ params }: PageProps<"/seller/[sellerId]">) => {
  const { sellerId } = await params;
  const userId = Number(sellerId);

  if (!userId || Number.isNaN(userId)) {
    notFound();
  }

  let user;
  let products = [];
  try {
    const res = await Promise.all([
      getUser(userId),
      getUserProducts(userId).catch(() => []),
    ]);
    user = res[0];
    products = Array.isArray(res[1]) ? res[1] : [];
  } catch {
    notFound();
  }

  if (!user || !user.id) {
    notFound();
  }

  return (
    <div className="global-container">
      <div className={styles.container}>
        <aside className={styles.aside}>
          <UserCard user={user} defaultProductId={products[0]?.id} />
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
