import Link from "next/link";

import { getProductById } from "@/api/requests";
import { LikeButton } from "@/components/like-button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
  Typography,
} from "@/components/ui";
import { formatPrice } from "@/lib/format";

import { Gallery, SellerCard } from "./_components";

import styles from "./page.module.css";

const ProductPage = async ({ params }: PageProps<"/product/[productId]">) => {
  const { productId } = await params;
  const product = await getProductById(Number(productId));

  return (
    <div className="global-container">
      <Breadcrumb className={styles.breadcrumb}>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Главная</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">{product.category.name}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">{product.subCategory.name}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          {product.type && (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  {/* @ts-expect-error - type will be fixed later */}
                  <Link href="/">{product.type.name}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </>
          )}
        </BreadcrumbList>
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
                {formatPrice(product.price)}
              </Typography>

              <LikeButton
                initLiked={product.isFavorited}
                productId={product.id}
              />
            </div>
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
                      const entries = Object.entries(fieldValue).filter(
                        ([key]) => key !== "id",
                      );
                      return entries.map(([fieldName, value]) => (
                        <div
                          key={`${fieldValue.id}-${fieldName}`}
                          className={styles.fieldItem}
                        >
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
                <Typography>{product.address}</Typography>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
