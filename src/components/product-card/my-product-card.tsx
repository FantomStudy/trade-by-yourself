"use client";

import type { Product } from "@/types";

import { Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { useDeleteProductMutation } from "@/api/hooks";
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
  const [isDeleting, setIsDeleting] = useState(false);

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

  return (
    <article className={styles.card}>
      <div className="relative">
        <Link href={`/product/${product.id}`}>
          <ProductPreview images={product.images} />
        </Link>

        <div className="absolute top-2 right-2 flex gap-1">
          <button
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-md transition-all hover:scale-110 hover:bg-white disabled:opacity-50"
            disabled={isDeleting}
            title="Редактировать"
            type="button"
            onClick={handleEdit}
          >
            <Edit className="h-4 w-4 text-blue-600" />
          </button>
          <button
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-md transition-all hover:scale-110 hover:bg-white disabled:opacity-50"
            disabled={isDeleting}
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
