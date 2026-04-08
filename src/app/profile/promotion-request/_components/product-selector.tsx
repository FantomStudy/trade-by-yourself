"use client";

import type { Product } from "@/types";
import { Check } from "lucide-react";
import Image from "next/image";

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
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center">
        <p className="text-gray-600">У вас нет активных товаров для продвижения</p>
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {products.map((product) => {
        const isSelected = product.id === selectedProductId;
        const mainImage = product.images?.[0];

        return (
          <button
            key={product.id}
            className={`relative flex items-start gap-4 rounded-lg border-2 p-4 text-left transition-all ${
              isSelected
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 bg-white hover:border-gray-300"
            }`}
            type="button"
            onClick={() => onSelectProduct(product.id)}
          >
            {/* Изображение товара */}
            <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
              {mainImage ? (
                <Image fill alt={product.name} className="object-cover" src={mainImage} />
              ) : (
                <div className="flex h-full items-center justify-center text-gray-400">
                  <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            <div className="min-w-0 flex-1">
              <h4 className="mb-1 line-clamp-2 text-sm font-semibold text-gray-900">
                {product.name}
              </h4>
              <p className="text-lg font-bold text-blue-600">{formatPrice(product.price)}</p>
              {product.address && (
                <p className="mt-1 line-clamp-1 text-xs text-gray-500">{product.address}</p>
              )}
            </div>

            {/* Индикатор выбора */}
            {isSelected && (
              <div className="absolute top-4 right-4 flex h-6 w-6 items-center justify-center rounded-full bg-blue-500">
                <Check className="h-4 w-4 text-white" />
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
};
