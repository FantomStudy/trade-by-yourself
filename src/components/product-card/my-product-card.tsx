"use client";

import type { Product } from "@/types";

import { Edit, Eye, EyeOff, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import {
  useDeleteProductMutation,
  useToggleProductMutation,
} from "@/api/hooks";
import { Typography } from "@/components/ui";
import { formatPrice } from "@/lib/format";

import { ProductPreview } from "./product-preview/product-preview";

import styles from "./product-card.module.css";

interface MyProductCardProps {
  product: Product;
}

export const MyProductCard = ({ product }: MyProductCardProps) => {
  const router = useRouter();
  const deleteProductMutation = useDeleteProductMutation();
  const toggleProductMutation = useToggleProductMutation();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!confirm("Вы уверены, что хотите удалить это объявление?")) {
      return;
    }

    setIsDeleting(true);
    try {
      await deleteProductMutation.mutateAsync(product.id);
      router.refresh();
    } catch (error) {
      console.error("Error deleting product:", error);
      // eslint-disable-next-line no-alert
      alert("Ошибка при удалении товара");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/profile/my-products/${product.id}`);
  };

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsToggling(true);
    try {
      await toggleProductMutation.mutateAsync(product.id);
      router.refresh();
    } catch (error) {
      console.error("Error toggling product:", error);
      alert("Ошибка при изменении статуса товара");
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <article className={styles.card}>
      <div className="relative">
        <Link href={`/product/${product.id}`}>
          <div className={product.isHide ? "relative" : ""}>
            <ProductPreview images={product.images} />
            {product.isHide && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-900/60">
                <span className="text-center text-lg font-semibold text-red-500">
                  Объявление снято с продажи
                </span>
              </div>
            )}
          </div>
        </Link>

        <div className="absolute top-2 right-2 flex gap-1">
          <button
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-md transition-all hover:scale-110 hover:bg-white disabled:opacity-50"
            disabled={isDeleting || isToggling}
            title={product.isHide ? "Вернуть в продажу" : "Снять с продажи"}
            type="button"
            onClick={handleToggle}
          >
            {product.isHide ? (
              <Eye className="h-4 w-4 text-green-600" />
            ) : (
              <EyeOff className="h-4 w-4 text-orange-600" />
            )}
          </button>
          <button
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-md transition-all hover:scale-110 hover:bg-white disabled:opacity-50"
            disabled={isDeleting || isToggling}
            title="Редактировать"
            type="button"
            onClick={handleEdit}
          >
            <Edit className="h-4 w-4 text-blue-600" />
          </button>
          <button
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-md transition-all hover:scale-110 hover:bg-white disabled:opacity-50"
            disabled={isDeleting || isToggling}
            title={isDeleting ? "Удаление..." : "Удалить"}
            type="button"
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4 text-red-600" />
          </button>
        </div>
      </div>

      <div className={styles.info}>
        <Link href={`/product/${product.id}`}>
          <Typography className={styles.name}>{product.name}</Typography>
        </Link>

        <div className={styles.meta}>
          <Typography>{product.address}</Typography>
          <Typography>{product.createdAt}</Typography>
        </div>

        <Typography className={styles.price}>
          {formatPrice(product.price)}
        </Typography>
      </div>
    </article>
  );
};
