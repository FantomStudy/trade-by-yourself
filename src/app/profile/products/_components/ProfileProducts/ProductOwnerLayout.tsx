"use client";

import { EditIcon, EyeIcon, Trash2Icon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui";
import styles from "./ProductOwnerLayout.module.css";

interface ProductOwnerLayoutProps {
  productId: number;
}

export const ProductOwnerLayout = ({ productId }: ProductOwnerLayoutProps) => {
  return (
    <div className={styles.toolbar}>
      <Button variant="outline" size="icon-sm">
        <EyeIcon color="var(--pink)" />
      </Button>

      <Button
        variant="outline"
        size="icon-sm"
        render={<Link href={`/profile_new/products/${productId}`} />}
      >
        <EditIcon color="var(--primary)" />
      </Button>

      <Button variant="outline" size="icon-sm">
        <Trash2Icon color="var(--destructive)" />
      </Button>
    </div>
  );
};
