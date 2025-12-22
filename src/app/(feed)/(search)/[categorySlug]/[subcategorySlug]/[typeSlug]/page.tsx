import Link from "next/link";
import { notFound } from "next/navigation";

import { Filters } from "../../../_components/filters";
import { getCategoryBySlug } from "../../../_features/category";
import { ProductFeed } from "../../../_features/feed";
import { Breadcrumb } from "../../../_lib/ui/breadcrumb";
import { safe } from "../../../_lib/utils/safe";

import styles from "../../page.module.css";

// TODO: См. комментарий в src/features/categories/api/get-category-by-slug.ts
const Page = async ({
  params,
}: PageProps<"/[categorySlug]/[subcategorySlug]/[typeSlug]">) => {
  const { categorySlug, subcategorySlug, typeSlug } = await params;

  const request = await safe(getCategoryBySlug(`${categorySlug}`));

  if (request.success === false) {
    if (request.status === 404) return notFound();
    return <div>Ошибка загрузки подкатегории</div>;
  }

  const category = request.data;
  const subcategory = category?.subCategories.find(
    (s) => s.slug === subcategorySlug,
  );
  const type = subcategory?.subcategoryTypes.find((t) => t.slug === typeSlug);

  if (!subcategory || !type) {
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
            <Breadcrumb.Link asChild>
              <Link href={`/${categorySlug}/${subcategorySlug}`}>
                {subcategory.name}
              </Link>
            </Breadcrumb.Link>
          </Breadcrumb.Item>

          <Breadcrumb.Separator />

          <Breadcrumb.Item>
            <Breadcrumb.Page>{type.name}</Breadcrumb.Page>
          </Breadcrumb.Item>
        </Breadcrumb.List>
      </Breadcrumb>

      <Filters>
        <ProductFeed filters={{ typeId: type.id }} />
      </Filters>
    </>
  );
};

export default Page;
