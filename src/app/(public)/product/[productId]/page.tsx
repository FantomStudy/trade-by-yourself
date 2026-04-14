import type { DetailedProduct } from "@/api/products";
import Link from "next/link";
import { getCurrentUser } from "@/api/auth";
import { getProduct } from "@/api/products";
import { LikeButton } from "@/components/LikeButton";
import { OwnedProductActions } from "@/components/OwnedProductActions";
import { Breadcrumb, Typography } from "@/components/ui";
import { formatPrice } from "@/lib/format";
import { Gallery, Map, ReviewForm, SellerCard } from "./_components";
import styles from "./page.module.css";

const ProductBreadcrumb = ({ product }: { product: DetailedProduct }) => {
  return (
    <Breadcrumb>
      <Breadcrumb.List>
        <Breadcrumb.Item>
          <Breadcrumb.Link render={<Link href="/" />}>Главная</Breadcrumb.Link>
        </Breadcrumb.Item>
        <Breadcrumb.Separator />
        <Breadcrumb.Item>
          <Breadcrumb.Link render={<Link href={`/${product.category.slug}`} />}>
            {product.category.name}
          </Breadcrumb.Link>
        </Breadcrumb.Item>
        <Breadcrumb.Separator />
        <Breadcrumb.Item>
          <Breadcrumb.Link
            render={<Link href={`/${product.category.slug}/${product.subCategory.slug}`} />}
          >
            {product.subCategory.name}
          </Breadcrumb.Link>
        </Breadcrumb.Item>
        {product.type && (
          <>
            <Breadcrumb.Separator />
            <Breadcrumb.Item>
              <Breadcrumb.Link
                render={
                  <Link
                    href={`/${product.category.slug}/${product.subCategory.slug}/${product.type.slug}`}
                  />
                }
              >
                {product.type.name}
              </Breadcrumb.Link>
            </Breadcrumb.Item>
          </>
        )}
      </Breadcrumb.List>
    </Breadcrumb>
  );
};

const ProductPage = async ({ params }: PageProps<"/product/[productId]">) => {
  const { productId } = await params;

  const product = await getProduct(Number(productId));
  const user = await getCurrentUser().catch(() => null);

  const isOwner = user?.id === product.seller.id;

  return (
    <div className="container">
      <ProductBreadcrumb product={product} />

      <div className={styles.wrapper}>
        <aside className={styles.aside}>
          <SellerCard user={product.seller} isOwner={isOwner} />
        </aside>

        <main className={styles.main}>
          <div className={styles.meta}>
            <div className={styles.metaInfo}>
              <Typography variant="h1">{product.name}</Typography>
              <Typography variant="h2" className={styles.price}>
                {formatPrice(product.price)}
              </Typography>
            </div>

            {user && (
              <LikeButton size="icon" initLiked={product.isFavorited} productId={product.id} />
            )}
          </div>

          <Gallery images={product.images} videoUrl={product.videoUrl} />

          <div className={styles.about}>
            <div className={styles.block}>
              <Typography variant="h2">Описание</Typography>
              <Typography>{product.description}</Typography>
            </div>

            {product.fieldValues.length > 0 && (
              <div className={styles.block}>
                <Typography variant="h2">Характеристики</Typography>
                {product.fieldValues.map((field) => {
                  const [key, value] = Object.entries(field)[0];
                  return (
                    <Typography key={key}>
                      {key}: {value}
                    </Typography>
                  );
                })}
              </div>
            )}

            {product.address && (
              <div className={styles.block}>
                <Typography variant="h2">Местоположение</Typography>
                <Typography>{product.address}</Typography>
                <Map address={product.address} />
              </div>
            )}
          </div>

          {isOwner ? (
            <OwnedProductActions
              productId={product.id}
              isHidden={product.isHide}
              redirectAfterDelete="/profile/products"
            />
          ) : user ? (
            <ReviewForm sellerId={product.seller.id} sellerName={product.seller.fullName} />
          ) : (
            <Typography>Войдите, чтобы оставить отзыв о продавце</Typography>
          )}
        </main>
      </div>
    </div>
  );
};

export default ProductPage;
