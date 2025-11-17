"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import type { ExtendedProduct } from "@/types";

import { getProductById } from "@/api/requests";
import { LikeButton } from "@/components/product/product-card/like-button";

import { SellerSidebar } from "./_components";

import styles from "./page.module.css";

interface ProductPageProps {
  params: Promise<{ productId: string }>;
}

const ProductPage = ({ params }: ProductPageProps) => {
  const [product, setProduct] = useState<ExtendedProduct | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setIsLoading(true);
        const resolvedParams = await params;
        const productId = Number(resolvedParams.productId);
        const data = await getProductById(productId);
        console.log(data);

        setProduct(data);
        setIsFavorite(data.isFavorited || false);
      } catch (err) {
        setError("Не удалось загрузить товар");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadProduct();
  }, [params]);

  const nextImage = () => {
    if (!product) return;
    setCurrentImageIndex((prev) =>
      prev === product.images.length - 1 ? 0 : prev + 1,
    );
  };

  const prevImage = () => {
    if (!product) return;
    setCurrentImageIndex((prev) =>
      prev === 0 ? product.images.length - 1 : prev - 1,
    );
  };

  const formatPrice = (price: number) => {
    return `${price.toLocaleString()} руб.`;
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Загрузка...</div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>{error || "Товар не найден"}</div>
      </div>
    );
  }

  return (
    <div className={styles.pageLayout}>
      {/* Сайдбар продавца слева */}
      <aside className={styles.sidebar}>
        {product.seller && (
          <SellerSidebar
            seller={{
              id: product.seller.id,
              fullName: product.seller.fullName,
              phoneNumber: product.seller.phoneNumber,
              profileType: product.seller.profileType,
              rating: product.seller.rating,
              reviewsCount: product.seller.reviewsCount,
            }}
          />
        )}
      </aside>

      {/* Основной контент справа */}
      <main className={styles.mainContent}>
        {/* Основная карточка продукта */}
        <div className={styles.productCard}>
          {/* Заголовок с названием, ценой и кнопкой избранного */}
          <div className={styles.productHeader}>
            <div className={styles.headerTop}>
              <div>
                <h1 className={styles.productTitle}>{product.name}</h1>
                <p className={styles.productPrice}>
                  {formatPrice(product.price)}
                </p>
              </div>
              <LikeButton initLiked={isFavorite} productId={product.id} />
            </div>
          </div>

          {/* Галерея изображений */}
          <div className={styles.imageGallery}>
            {/* Миниатюры слева */}
            {product.images.length > 1 && (
              <div className={styles.thumbnails}>
                {product.images.map((image, index) => (
                  <button
                    key={`${image}-${index}`}
                    type="button"
                    className={`${styles.thumbnail} ${
                      index === currentImageIndex ? styles.active : ""
                    }`}
                    onClick={() => setCurrentImageIndex(index)}
                  >
                    <Image
                      fill
                      alt={`${product.name} ${index + 1}`}
                      src={image}
                      style={{ objectFit: "cover" }}
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Главное изображение справа */}
            <div className={styles.mainImageWrapper}>
              <Image
                fill
                alt={product.name}
                className={styles.mainImage}
                src={product.images[currentImageIndex]}
                style={{ objectFit: "contain" }}
                priority
              />

              {product.images.length > 1 && (
                <>
                  <button
                    type="button"
                    className={`${styles.navigationButton} ${styles.prevButton}`}
                    onClick={prevImage}
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    className={`${styles.navigationButton} ${styles.nextButton}`}
                    onClick={nextImage}
                  >
                    →
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Описание */}
        {product.description && (
          <div className={styles.infoSection}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle} style={{ color: "#3498db" }}>
                Описание
              </h2>
            </div>
            <div className={styles.sectionContent}>
              <p className={styles.description}>{product.description}</p>
            </div>
          </div>
        )}

        {/* Местоположение */}
        <div className={styles.infoSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle} style={{ color: "#e74c3c" }}>
              Местоположение
            </h2>
          </div>
          <div className={styles.sectionContent}>
            <p className={styles.location}>{product.address}</p>
          </div>
        </div>

        {/* Характеристики */}
        {(product.brand || product.model) && (
          <div className={styles.infoSection}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle} style={{ color: "#27ae60" }}>
                Характеристики
              </h2>
            </div>
            <div className={styles.sectionContent}>
              {product.brand && <p>Бренд: {product.brand}</p>}
              {product.model && <p>Модель: {product.model}</p>}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ProductPage;
