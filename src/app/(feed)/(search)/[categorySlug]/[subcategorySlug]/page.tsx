import Link from "next/link";
import { notFound } from "next/navigation";

import { getCategory } from "@/api-lab/categories/getCategory";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui-lab/Breadcrumb";
import { ProductFeed } from "../../_features/feed";
import { safe } from "../../_lib/utils/safe";
import styles from "../page.module.css";

// TODO: См. комментарий в src/features/categories/api/get-category-by-slug.ts
const Page = async ({
  params,
}: PageProps<"/[categorySlug]/[subcategorySlug]">) => {
  const { categorySlug, subcategorySlug } = await params;

  const request = await safe(getCategory(categorySlug));

  if (request.success === false) {
    if (request.status === 404) return notFound();
    return <div>Ошибка загрузки подкатегории</div>;
  }

  const category = request.data;
  const subcategory = category?.subCategories.find(
    (s) => s.slug === subcategorySlug,
  );

  if (!subcategory) {
    return notFound();
  }

  return (
    <>
      <Breadcrumb>
        <BreadcrumbList className={styles.breadcrumb}>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Главная</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbSeparator />

          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={`/${categorySlug}`}>{category.name}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbSeparator />

          <BreadcrumbItem>
            <BreadcrumbPage>{subcategory.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <ProductFeed
        filters={{
          categorySlug,
          subCategorySlug: subcategorySlug,
        }}
      />
    </>
  );
};

export default Page;
