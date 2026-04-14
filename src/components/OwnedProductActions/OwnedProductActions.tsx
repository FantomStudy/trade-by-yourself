"use client";

import type { Route } from "next";
import { useMutation } from "@tanstack/react-query";
import clsx from "clsx";
import { EditIcon, EyeIcon, EyeOffIcon, Trash2Icon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { deleteProduct, toggleProduct } from "@/api/products";
import { Button } from "@/components/ui";
import styles from "./OwnedProductActions.module.css";

interface OwnedProductActionsProps extends React.ComponentProps<"div"> {
  productId: number;
  isHidden?: boolean;
  variant?: "default" | "compact";
  redirectAfterDelete?: Route | null;
}

export const OwnedProductActions = ({
  productId,
  isHidden,
  variant = "default",
  className,
  redirectAfterDelete = null,
  ...props
}: OwnedProductActionsProps) => {
  const router = useRouter();
  const editHref = `/profile/products/edit/${productId}` as Route;

  const toggleMutation = useMutation({
    mutationFn: () => toggleProduct(productId),
    onSuccess: () => router.refresh(),
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteProduct(productId),
    onSuccess: () => {
      if (redirectAfterDelete) {
        router.push(redirectAfterDelete);
        return;
      }

      router.refresh();
    },
  });

  const handleDelete = () => {
    if (!window.confirm("Удалить объявление?")) return;
    deleteMutation.mutate();
  };

  const isCompact = variant === "compact";
  const isBusy = toggleMutation.isPending || deleteMutation.isPending;

  if (isCompact) {
    return (
      <div className={clsx(styles.actions, styles.compact, className)} {...props}>
        {typeof isHidden === "boolean" && (
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => toggleMutation.mutate()}
            disabled={isBusy}
            aria-label={isHidden ? "Вернуть в продажу" : "Снять с продажи"}
            title={isHidden ? "Вернуть в продажу" : "Снять с продажи"}
          >
            {isHidden ? <EyeIcon /> : <EyeOffIcon />}
          </Button>
        )}

        <Button
          variant="outline"
          size="icon-sm"
          render={<Link href={editHref} />}
          nativeButton={false}
          aria-label="Редактировать"
          title="Редактировать"
        >
          <EditIcon color="var(--primary)" />
        </Button>

        <Button
          variant="outline"
          size="icon-sm"
          onClick={handleDelete}
          disabled={isBusy}
          aria-label="Удалить"
          title="Удалить"
        >
          <Trash2Icon color="var(--danger)" />
        </Button>
      </div>
    );
  }

  return (
    <div className={clsx(styles.actions, className)} {...props}>
      {typeof isHidden === "boolean" && (
        <Button
          variant={isHidden ? "primary" : "danger"}
          onClick={() => toggleMutation.mutate()}
          disabled={isBusy}
        >
          {isHidden ? <EyeIcon /> : <EyeOffIcon />}
          {isHidden ? "Вернуть в продажу" : "Снять с продажи"}
        </Button>
      )}

      <Button render={<Link href={editHref} />} nativeButton={false}>
        <EditIcon /> Редактировать
      </Button>

      <Button variant="outline" onClick={handleDelete} disabled={isBusy}>
        <Trash2Icon /> Удалить
      </Button>
    </div>
  );
};
