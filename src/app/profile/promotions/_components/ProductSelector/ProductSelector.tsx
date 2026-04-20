"use client";

import type { Product } from "@/api/products";
import { Check } from "lucide-react";
import Image from "next/image";
import styles from "./ProductSelector.module.css";

interface ProductSelectorProps {
  products: Product[];
  selectedProductId: number | null;
  onSelectProduct: (productId: number) => void;
}

export const ProductSelector = ({
  products,
  selectedProductId,
  onSelectProduct,
}: ProductSelectorProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (products.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p className={styles.emptyText}>У вас нет активных товаров для продвижения</p>
      </div>
    );
  }

  return (
    <div className={styles.grid}>
      {products.map((product) => {
        const isSelected = product.id === selectedProductId;
        const mainImage = product.images?.[0];

        return (
          <button
            key={product.id}
            className={`${styles.card} ${isSelected ? styles.cardSelected : styles.cardIdle}`}
            type="button"
            onClick={() => onSelectProduct(product.id)}
          >
            {/* Изображение товара */}
            <div className={styles.imageWrap}>
              {mainImage ? (
                <Image fill alt={product.name} className={styles.image} src={mainImage} />
              ) : (
                <div className={styles.imageFallback}>
                  <svg
                    className={styles.imageFallbackIcon}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                    />
                  </svg>
                </div>
              )}
            </div>

            {/* Информация о товаре */}
            <div className={styles.content}>
              <h4 className={styles.name}>{product.name}</h4>
              <p className={styles.price}>{formatPrice(product.price)}</p>
              {product.address && <p className={styles.address}>{product.address}</p>}
            </div>

            {/* Индикатор выбора */}
            {isSelected && (
              <div className={styles.selectedBadge}>
                <Check className={styles.selectedBadgeIcon} />
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
};
