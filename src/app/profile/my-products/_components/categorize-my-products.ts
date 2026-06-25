import type { Product } from "@/types";

import type { MyProductsTab } from "./my-products-tabs";

export function categorizeMyProducts(products: Product[], drafts: Product[]) {
  const draftIds = new Set(drafts.map((draft) => draft.id));
  const rest = products.filter((product) => !draftIds.has(product.id));

  const isModeration = (product: Product) =>
    product.moderateState === "MODERATE" ||
    product.moderateState === "AI_REVIEWED" ||
    (!product.moderateState && !product.isHide);
  const isDenied = (product: Product) =>
    product.moderateState === "DENIDED" || product.moderateState === "DENIED";
  const isActive = (product: Product) => product.moderateState === "APPROVED" && !product.isHide;
  const isHidden = (product: Product) => product.moderateState === "APPROVED" && product.isHide;

  const moderation = rest.filter(isModeration);
  const denied = rest.filter(isDenied);
  const active = rest.filter(isActive);
  const hidden = rest.filter(isHidden);

  return { active, moderation, hidden, denied, drafts };
}

export function resolveMyProductsTab(raw: string | string[] | undefined): MyProductsTab {
  const value = Array.isArray(raw) ? raw[0] : raw;
  if (value === "drafts") return "drafts";
  if (value === "moderation") return "moderation";
  if (value === "hidden") return "hidden";
  if (value === "denied") return "denied";
  return "active";
}

export function myProductsTabHref(tab: MyProductsTab): string {
  if (tab === "active") return "/profile/my-products";
  return `/profile/my-products?tab=${tab}`;
}
