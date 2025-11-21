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
                  <Link href="/">{product.type}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </>
          )}
        </BreadcrumbList>
      </Breadcrumb>

      <div className={styles.container}>
        <div className={styles.productInfo}>
          <div>
            <Typography variant="h1">{product.name}</Typography>
            <div className={styles.productMeta}>
              <Typography className="text-primary" variant="h2">
                {formatPrice(product.price)}
              </Typography>

              <LikeButton
                initLiked={product.isFavorited}
                productId={product.id}
              />
            </div>
          </div>

          <Gallery images={product.images} />

          {product.description && (
            <div className={styles.section}>
              <Typography variant="h2">Описание</Typography>
              <Typography>{product.description}</Typography>
            </div>
          )}

          <div className={styles.section}>
            <Typography variant="h2">Характеристики</Typography>
            {product.fieldValues &&
              !Array.isArray(product.fieldValues) &&
              Object.keys(product.fieldValues).length > 0 && (
                <div className={styles.infoSection}>
                  <div className={styles.sectionHeader}>
                    <h2
                      className={styles.sectionTitle}
                      style={{ color: "#27ae60" }}
                    >
                      Характеристики
                    </h2>
                  </div>
                  <div className={styles.sectionContent}>
                    {Object.entries(product.fieldValues).map(
                      ([fieldId, value]) => (
                        <p key={fieldId}>{value}</p>
                      ),
                    )}
                  </div>
                </div>
              )}
          </div>

          {product.address && (
            <div className={styles.section}>
              <Typography variant="h2">Местоположение</Typography>
              <Typography>{product.address}</Typography>
            </div>
          )}
        </div>
        <aside className={styles.aside}>
          <SellerCard product={product} />
        </aside>
      </div>
    </div>
  );
};

export default ProductPage;
