import Link from "next/link";
import { getProductById } from "@/api/requests";
import { LikeButton } from "@/components/LikeButton";
import { Typography } from "@/components/ui";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { toCurrency } from "@/lib/format";
import { Gallery, ProductMap, ReviewForm, SellerCard, ToggleProductButton } from "./_components";
import styles from "./page.module.css";

const ProductPage = async ({ params }: PageProps<"/product/[productId]">) => {
  const { productId } = await params;

  const product = await getProductById(Number(productId));

  return (
    <div className="global-container">
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

      <div className={styles.container}>
        <aside className={styles.aside}>
          <SellerCard product={product} />
        </aside>

        <div className={styles.productInfo}>
          <div>
            <Typography variant="h1">{product.name}</Typography>
            <div className={styles.productMeta}>
              <Typography className={styles.price} variant="h2">
                {toCurrency(product.price)}
              </Typography>

              <LikeButton size="icon" initLiked={product.isFavorited} productId={product.id} />
            </div>
            <Typography>В наличии: {product.quantity ?? 1} шт.</Typography>
          </div>

          <Gallery images={product.images} videoUrl={product.videoUrl} />

          <div className={styles.section}>
            {product.description && (
              <div className={styles.sectionBlock}>
                <Typography variant="h2">Описание</Typography>
                <div className={styles.description}>
                  <Typography>{product.description}</Typography>
                </div>
              </div>
            )}

            {product.fieldValues &&
              Array.isArray(product.fieldValues) &&
              product.fieldValues.length > 0 && (
                <div className={styles.sectionBlock}>
                  <Typography variant="h2">Характеристики</Typography>
                  <div className={styles.sectionContent}>
                    {product.fieldValues.map((fieldValue) => {
                      const entries = Object.entries(fieldValue).filter(([key]) => key !== "id");
                      return entries.map(([fieldName, value]) => (
                        <div key={`${fieldValue.id}-${fieldName}`} className={styles.fieldItem}>
                          {fieldName}: {value}
                        </div>
                      ));
                    })}
                  </div>
                </div>
              )}

            {product.address && (
              <div className={styles.sectionBlock}>
                <Typography variant="h2">Местоположение</Typography>
                <Typography className="mb-4">{product.address}</Typography>
                <ProductMap address={product.address} />
              </div>
            )}
          </div>

          <ReviewForm sellerId={product.seller.id} sellerName={product.seller.fullName} />

          <ToggleProductButton
            isHidden={product.isHide ?? false}
            sellerId={product.seller.id}
            productId={product.id}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
