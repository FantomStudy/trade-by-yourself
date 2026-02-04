import Link from "next/link";
import { notFound } from "next/navigation";

import { getCategoryBySlug } from "../../_features/category";
import { ProductFeed } from "../../_features/feed";
import { Breadcrumb } from "../../_lib/ui/breadcrumb";
import { safe } from "../../_lib/utils/safe";

import styles from "../page.module.css";

// TODO: См. комментарий в src/features/categories/api/get-category-by-slug.ts
const Page = async ({
  params,
}: PageProps<"/[categorySlug]/[subcategorySlug]">) => {
  const { categorySlug, subcategorySlug } = await params;

  const request = await safe(getCategoryBySlug(`${categorySlug}`));

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
        <Breadcrumb.List className={styles.breadcrumb}>
          <Breadcrumb.Item>
            <Breadcrumb.Link asChild>
              <Link href="/">Главная</Link>
            </Breadcrumb.Link>
          </Breadcrumb.Item>

          <Breadcrumb.Separator />

          <Breadcrumb.Item>
            <Breadcrumb.Link asChild>
              <Link href={`/${categorySlug}`}>{category.name}</Link>
            </Breadcrumb.Link>
          </Breadcrumb.Item>

          <Breadcrumb.Separator />

          <Breadcrumb.Item>
            <Breadcrumb.Page>{subcategory.name}</Breadcrumb.Page>
          </Breadcrumb.Item>
        </Breadcrumb.List>
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
