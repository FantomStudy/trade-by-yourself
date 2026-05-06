import type { ProductFilters } from "@/api/products";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategory } from "@/api/categories";
import { ProductGrid } from "@/components/ProductGrid";
import { Breadcrumb } from "@/components/ui/lab/Breadcrumb";
import { FeedCard, FeedList } from "../_components/FeedList";
import { getFeed } from "../_lib/getFeed";
import styles from "./page.module.css";

const CategoryPage = async ({ params, searchParams }: PageProps<"/[...categorySlugs]">) => {
  const { categorySlugs } = await params;
  const filterParams = await searchParams;

  if (categorySlugs.length > 3) notFound();

  const [categorySlug, subcategorySlug, typeSlug] = categorySlugs;

  const category = await getCategory(categorySlug).catch((err) => {
    if (err.status === 404) notFound();
    return null;
  });

  if (!category) return <div>Ошибка загрузки категории</div>;

  const subcategory = subcategorySlug
    ? category.subCategories.find((s) => s.slug === subcategorySlug)
    : undefined;

  if (subcategorySlug && !subcategory) notFound();

  const type =
    typeSlug && subcategory
      ? subcategory.subcategoryTypes.find((t) => t.slug === typeSlug)
      : undefined;

  if (typeSlug && !type) notFound();

  const filters: ProductFilters = {
    ...filterParams,
    categorySlug,
    subCategorySlug: subcategorySlug,
    typeSlug,
  };

  const initialItems = await getFeed({ ...filters, page: 1 });

  return (
    <div>
      <Breadcrumb>
        <Breadcrumb.List className={styles.breadcrumb}>
          <Breadcrumb.Item>
            <Breadcrumb.Link render={<Link href="/" />}>Главная</Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Separator />
          <Breadcrumb.Item>
            {!subcategory ? (
              <Breadcrumb.Page>{category.name}</Breadcrumb.Page>
            ) : (
              <Breadcrumb.Link render={<Link href={`/${categorySlug}`} />}>
                {category.name}
              </Breadcrumb.Link>
            )}
          </Breadcrumb.Item>
          {subcategory && (
            <>
              <Breadcrumb.Separator />
              <Breadcrumb.Item>
                {!type ? (
                  <Breadcrumb.Page>{subcategory.name}</Breadcrumb.Page>
                ) : (
                  <Breadcrumb.Link render={<Link href={`/${categorySlug}/${subcategorySlug}`} />}>
                    {subcategory.name}
                  </Breadcrumb.Link>
                )}
              </Breadcrumb.Item>
            </>
          )}
          {type && (
            <>
              <Breadcrumb.Separator />
              <Breadcrumb.Item>
                <Breadcrumb.Page>{type.name}</Breadcrumb.Page>
              </Breadcrumb.Item>
            </>
          )}
        </Breadcrumb.List>
      </Breadcrumb>

      <ProductGrid>
        {initialItems.map((item) => (
          <FeedCard key={item.key} item={item} />
        ))}
        <FeedList filters={filters} />
      </ProductGrid>
    </div>
  );
};

export default CategoryPage;
