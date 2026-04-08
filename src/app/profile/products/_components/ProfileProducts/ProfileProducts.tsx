"use client";

import { ProductCard } from "@/components/ProductCard";
import { Grid } from "@/components/ui";
import { useUserProducts } from "@/hooks/useUserProducts";
import { ProductOwnerLayout } from "./ProductOwnerLayout";

interface ProfileProductsProps {
  userId: number;
}

export const ProfileProducts = ({ userId }: ProfileProductsProps) => {
  const products = useUserProducts(userId);

  if (!products.data) return null;

  return (
    <Grid>
      {products.data.map((product) => (
        <ProductCard key={product.id} product={product}>
          <ProductOwnerLayout productId={product.id} />
        </ProductCard>
      ))}
    </Grid>
  );
};
