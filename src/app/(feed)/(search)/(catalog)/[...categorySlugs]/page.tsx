import type { ProductFilters } from "@/api/products/getProducts";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBanners } from "@/api/banners/getBanners";
import { getCategory } from "@/api/categories/getCategory";
import { getProducts } from "@/api/products/getProducts";
import { FeedList, FeedListItem, PRODUCT_PAGE_LIMIT } from "@/components/FeedList";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/Breadcrumb";
import { Grid } from "@/components/ui/Grid";
import { mergeFeed } from "@/lib/mergeFeed";
import styles from "./page.module.css";

const CategoryPage = async ({ params, searchParams }: PageProps<"/[...categorySlugs]">) => {
  const { categorySlugs } = await params;
  const filters = await searchParams;

  const [categorySlug, subcategorySlug, typeSlug] = categorySlugs;

  const category = await getCategory(categorySlug).catch((err) => {
    if (err.status === 404) notFound();
    return null;
  });

  if (!category) return <div>Ошибка загрузки категории</div>;

  const subcategory = subcategorySlug
    ? category.subCategories.find((s) => s.slug === subcategorySlug)
    : undefined;

  const type =
    typeSlug && subcategory
      ? subcategory.subcategoryTypes.find((t) => t.slug === typeSlug)
      : undefined;

  const filterParams: ProductFilters = {
    ...filters,
    categorySlug,
    subCategorySlug: subcategorySlug,
    typeSlug,
  };

  const [products, narrowBanners, wideBanners] = await Promise.all([
    getProducts({ ...filterParams, page: 1, limit: PRODUCT_PAGE_LIMIT }),
    getBanners({ place: "PRODUCT_FEED" }),
    getBanners({ place: "PROFILE" }),
  ]);

  const merged = mergeFeed({ products, narrowBanners, wideBanners });

  return (
    <>
      <Breadcrumb>
        <BreadcrumbList className={styles.breadcrumb}>
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href="/" />}>Главная</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            {!subcategory ? (
              <BreadcrumbPage>{category.name}</BreadcrumbPage>
            ) : (
              <BreadcrumbLink render={<Link href={`/${categorySlug}`} />}>
                {category.name}
              </BreadcrumbLink>
            )}
          </BreadcrumbItem>
          {subcategory && (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {!type ? (
                  <BreadcrumbPage>{subcategory.name}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink render={<Link href={`/${categorySlug}/${subcategorySlug}`} />}>
                    {subcategory.name}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </>
          )}
          {type && (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{type.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </>
          )}
        </BreadcrumbList>
      </Breadcrumb>

      <Grid>
        {merged.map((item) => (
          <FeedListItem key={item.key} item={item} />
        ))}
        <FeedList filters={filterParams} />
      </Grid>
    </>
  );
};

export default CategoryPage;
