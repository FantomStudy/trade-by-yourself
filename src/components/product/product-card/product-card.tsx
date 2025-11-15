import Image from "next/image";
import Link from "next/link";

import type { Product } from "@/types";

import { ImageIcon, Typography } from "@/components/ui";
import { formatPrice } from "@/lib/format";

import { LikeButton } from "./like-button";

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <article className="bg-background flex h-full flex-col rounded-md">
      <Link href={`/product/${product.id}`}>
        <header className="pointer-events-none relative aspect-square w-full overflow-hidden rounded-md">
          {product.images[0] ? (
            <>
              <div
                style={{
                  backgroundImage: `url(${product.images[0]})`,
                }}
                className="absolute inset-0 bg-cover bg-center blur-xs grayscale-50"
              />
              <Image
                fill
                alt={product.name}
                className="object-contain"
                src={product.images[0] || "/placeholder.png"}
              />
            </>
          ) : (
            <div className="bg-accent grid size-full place-items-center">
              <ImageIcon className="text-muted-foreground size-16 stroke-1" />
            </div>
          )}
        </header>
      </Link>

      <div className="relative flex flex-1 flex-col gap-2 p-3 pr-10">
        <LikeButton
          className="absolute top-1 right-2"
          initLiked={product.isLiked}
          productId={product.id}
        />

        <Link href={`/product/${product.id}`}>
          <Typography className="hover:text-primary line-clamp-2 text-sm font-medium transition-all">
            {product.name}
          </Typography>
        </Link>

        <div className="mt-auto flex flex-col gap-1">
          <Typography className="text-muted-foreground truncate text-xs">
            {product.address}
          </Typography>
          <Typography className="text-muted-foreground truncate text-xs">
            {product.createdAt}
          </Typography>
        </div>

        <Typography className="text-primary text-lg font-bold">
          {formatPrice(product.price)}
        </Typography>
      </div>
    </article>
  );
};
