"use client";

import Image from "next/image";
import { useState } from "react";

import styles from "./page.module.css";

interface Product {
  id: number;
  name: string;
  address: string;
  characteristics?: string;
  createdAt: string;
  description?: string;
  images: string[];
  price: number;
}

// Моковые данные для примера
const mockProduct: Product = {
  id: 1,
  name: "Коляска для дома",
  address: "Москва",
  createdAt: "2025-09-09T21:18:00Z",
  price: 25000,
  images: [
    "/bed.png", // Используем существующие изображения
    "/clothes.png",
    "/bed.png",
    "/clothes.png",
  ],
  description:
    "Продам коляску инвалидную комнатную, использовали пару раз в комнате. Так же есть в наличии прогулочная коляска абсолютно новая, в коробке, ни разу не использовалась. Торг уместен",
  characteristics:
    "Продам коляску инвалидную комнатную, использовали пару раз в комнате. Так же есть в наличии прогулочная коляска абсолютно новая, в коробке, ни разу не использовалась. Торг уместен",
};

const mockRelatedProducts = [
  {
    id: 2,
    name: "Одежда",
    meta: "Оренбургская обл., г. Оренбург\n09.09.25 в 21:18",
    price: "3000 рублей",
    imageUrl: "/clothes.png",
  },
  {
    id: 3,
    name: "Одежда",
    meta: "Оренбургская обл., г. Оренбург\n09.09.25 в 21:18",
    price: "3000 рублей",
    imageUrl: "/bed.png",
  },
  {
    id: 4,
    name: "Одежда",
    meta: "Оренбургская обл., г. Оренбург\n09.09.25 в 21:18",
    price: "3000 рублей",
    imageUrl: "/clothes.png",
  },
];

const ProductPage = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === mockProduct.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? mockProduct.images.length - 1 : prev - 1
    );
  };

  const formatPrice = (price: number) => {
    return `${price.toLocaleString()} руб.`;
  };

  return (
    <div className={styles.container}>
      {/* Основная карточка продукта */}
      <div className={styles.productCard}>
        {/* Заголовок с названием, ценой и кнопкой избранного */}
        <div className={styles.productHeader}>
          <div className={styles.headerTop}>
            <div>
              <h1 className={styles.productTitle}>{mockProduct.name}</h1>
              <p className={styles.productPrice}>
                {formatPrice(mockProduct.price)}
              </p>
            </div>
            <button
              type="button"
              className={`${styles.favoriteButton} ${
                isFavorite ? styles.active : ""
              }`}
              onClick={() => setIsFavorite(!isFavorite)}
            ></button>
          </div>
        </div>

        {/* Галерея изображений */}
        <div className={styles.imageGallery}>
          <Image
            alt={mockProduct.name}
            className={styles.mainImage}
            height={400}
            src={mockProduct.images[currentImageIndex]}
            width={800}
            priority
          />

          {mockProduct.images.length > 1 && (
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

        {/* Миниатюры */}
        {mockProduct.images.length > 1 && (
          <div className={styles.thumbnails}>
            {mockProduct.images.map((image, index) => (
              <Image
                key={`thumbnail-${image}`}
                className={`${styles.thumbnail} ${
                  index === currentImageIndex ? styles.active : ""
                }`}
                alt={`${mockProduct.name} ${index + 1}`}
                height={80}
                src={image}
                width={80}
                onClick={() => setCurrentImageIndex(index)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Описание */}
      {mockProduct.description && (
        <div className={styles.infoSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle} style={{ color: "#3498db" }}>
              Описание
            </h2>
          </div>
          <div className={styles.sectionContent}>
            <p className={styles.description}>{mockProduct.description}</p>
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
          <p className={styles.location}>{mockProduct.address}</p>
        </div>
      </div>

      {/* Характеристики */}
      {mockProduct.characteristics && (
        <div className={styles.infoSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle} style={{ color: "#27ae60" }}>
              Характеристики
            </h2>
          </div>
          <div className={styles.sectionContent}>
            <p className={styles.characteristics}>
              {mockProduct.characteristics}
            </p>
          </div>
        </div>
      )}

      {/* Другие объявления */}
      <div className={styles.relatedProducts}>
        <h2 className={styles.relatedTitle}>Другие объявления</h2>
        <div className={styles.productGrid}>
          {mockRelatedProducts.map((product) => (
            <div key={product.id} className={styles.productItem}>
              <div style={{ position: "relative" }}>
                <Image
                  alt={product.name}
                  className={styles.productImage}
                  height={160}
                  src={product.imageUrl}
                  width={240}
                />
                <button type="button" className={styles.heart}>
                  ❤️
                </button>
              </div>
              <div className={styles.productInfo}>
                <h3 className={styles.productName}>{product.name}</h3>
                <p className={styles.productMeta}>{product.meta}</p>
                <p className={styles.productPrice2}>{product.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
