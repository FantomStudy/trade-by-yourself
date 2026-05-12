"use client";

import type { Route } from "next";
import type { Category } from "@/api/categories";
import { ChevronRightIcon, TextSearchIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Sheet } from "@/components/ui/Sheet";
import { useCategories } from "@/hooks/useCategories";
import styles from "./CategoryMenu.module.css";

interface TreeNode {
  id: number;
  name: string;
  href: Route;
  children: TreeNode[];
}

const buildTree = (categories: Category[]): TreeNode[] => {
  return categories.map((cat) => ({
    id: cat.id,
    name: cat.name,
    href: `/${cat.slug}` as Route,
    children: cat.subCategories.map((sub) => ({
      id: sub.id,
      name: sub.name,
      href: `/${cat.slug}/${sub.slug}` as Route,
      children: sub.subcategoryTypes.map((type) => ({
        id: type.id,
        name: type.name,
        href: `/${cat.slug}/${sub.slug}/${type.slug}` as Route,
        children: [],
      })),
    })),
  }));
};

const CategoryTreeItem = ({ node }: { node: TreeNode }) => {
  const [isOpen, setIsOpen] = useState(false);

  const hasChildren = node.children.length > 0;

  return (
    <div className={styles.item}>
      <div className={styles.row}>
        <Sheet.Close
          nativeButton={false}
          render={
            <Button
              variant="ghost"
              size="sm"
              className={styles.label}
              nativeButton={false}
              render={<Link href={node.href}>{node.name}</Link>}
            />
          }
        />

        {hasChildren && (
          <Button
            variant="ghost"
            size="icon-sm"
            className={styles.chevron}
            data-open={isOpen}
            onClick={() => setIsOpen((prev) => !prev)}
            aria-label={isOpen ? "Свернуть" : "Развернуть"}
          >
            <ChevronRightIcon />
          </Button>
        )}
      </div>

      {hasChildren && isOpen && (
        <div className={styles.children}>
          {node.children.map((child) => (
            <CategoryTreeItem key={child.id} node={child} />
          ))}
        </div>
      )}
    </div>
  );
};

export const CategoryMenu = () => {
  const { data } = useCategories();

  const tree = data ? buildTree(data) : [];

  return (
    <Sheet>
      <Sheet.Trigger render={<Button />}>
        <TextSearchIcon /> Все категории
      </Sheet.Trigger>
      <Sheet.Content side="left">
        <Sheet.Header>
          <Sheet.Title>Выбор категории</Sheet.Title>
          <Sheet.Description>Выберите категорию, чтобы увидеть объявления</Sheet.Description>
        </Sheet.Header>

        <div className={styles.tree}>
          {tree.map((node) => (
            <CategoryTreeItem key={node.id} node={node} />
          ))}
        </div>
      </Sheet.Content>
    </Sheet>
  );
};
