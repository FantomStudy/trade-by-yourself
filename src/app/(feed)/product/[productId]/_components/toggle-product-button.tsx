"use client";

import { Eye, EyeOff, PencilIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useToggleProductMutation } from "@/api/hooks";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/lib/contexts";

interface ToggleProductButtonProps {
  isHidden: boolean;
  productId: number;
  sellerId: number;
}

export const ToggleProductButton = ({
  productId,
  sellerId,
  isHidden,
}: ToggleProductButtonProps) => {
  const { user } = useAuth();
  const router = useRouter();
  const toggleProductMutation = useToggleProductMutation();
  const [isToggling, setIsToggling] = useState(false);

  // Показываем кнопку только владельцу товара
  if (!user || user.id !== sellerId) {
    return null;
  }

  const handleToggle = async () => {
    setIsToggling(true);
    try {
      await toggleProductMutation.mutateAsync(productId);
      router.refresh();
    } catch (error) {
      console.error("Error toggling product:", error);
      alert("Ошибка при изменении статуса товара");
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <>
      <Button
        className="w-full"
        disabled={isToggling}
        variant={isHidden ? "primary" : "destructive"}
        onClick={handleToggle}
      >
        {isHidden ? (
          <>
            <Eye className="mr-2 h-4 w-4" />
            Вернуть в продажу
          </>
        ) : (
          <>
            <EyeOff className="mr-2 h-4 w-4" />
            Снять с продажи
          </>
        )}
      </Button>
      <Button nativeButton={false} render={<Link href={`/profile/my-products/${productId}`} />}>
        <PencilIcon className="size-4" /> Редактировать
      </Button>
    </>
  );
};
