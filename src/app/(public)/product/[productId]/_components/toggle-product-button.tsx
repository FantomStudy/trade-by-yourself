"use client";

import { Eye, EyeOff, PencilIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useToggleProductMutation, useUserInfo } from "@/api/hooks";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/lib/contexts";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/lib/api/get-api-error-message";
import { fixMojibake } from "@/lib/fix-mojibake";

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
  const { data: userInfo } = useUserInfo(user?.id);
  const router = useRouter();
  const toggleProductMutation = useToggleProductMutation();
  const [isToggling, setIsToggling] = useState(false);

  // Показываем кнопку только владельцу товара
  if (!user || user.id !== sellerId) {
    return null;
  }

  const handleToggle = async () => {
    // Если товар скрыт и возвращается в продажу — проверяем лимит
    if (isHidden) {
      const remainingFree = userInfo?.adsLimit?.remaining ?? 0;
      const costPerAd = userInfo?.adsLimit?.costPerAd ?? 50;

      if (remainingFree <= 0) {
        const userBalance = (userInfo?.balance ?? 0) + (userInfo?.bonusBalance ?? 0);
        const confirmMsg =
          userBalance < costPerAd
            ? `Бесплатный лимит объявлений в этом месяце исчерпан (6 из 6).\nДля продления объявления требуется ${costPerAd} ₽, а на вашем балансе ${userBalance} ₽.\nПополните баланс в профиле.`
            : `Бесплатный лимит объявлений в этом месяце исчерпан (6 из 6).\nПродление этого объявления на 30 дней стоит ${costPerAd} ₽.\nСписать ${costPerAd} ₽ с баланса и вернуть объявление в продажу?`;

        if (!confirm(confirmMsg)) {
          return;
        }
      }
    }

    setIsToggling(true);
    try {
      const res = await toggleProductMutation.mutateAsync(productId);
      toast.success(
        res?.message ||
          (isHidden ? "Объявление возвращено в продажу" : "Объявление снято с продажи"),
      );
      router.refresh();
    } catch (error) {
      console.error("Error toggling product:", error);
      const message = fixMojibake(getApiErrorMessage(error, "Ошибка при изменении статуса товара"));
      toast.error(message);
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
      <Button render={<Link href={`/profile/my-products/${productId}`} />} nativeButton={false}>
        <PencilIcon className="size-4" /> Редактировать
      </Button>
    </>
  );
};
