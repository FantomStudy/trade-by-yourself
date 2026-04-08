import type { ProductFilters } from "@/api/products";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBanners } from "@/api/banners";
import { getCategory } from "@/api/categories";
import { getProducts } from "@/api/products";
import { FeedList, FeedListItem, PRODUCT_PAGE_LIMIT } from "@/components/FeedList";
import { Breadcrumb, Grid } from "@/components/ui";
import { mergeFeed } from "@/lib/mergeFeed";

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
    <div>
      <Breadcrumb>
        <Breadcrumb.List>
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

      <Grid>
        {merged.map((item) => (
          <FeedListItem key={item.key} item={item} />
        ))}
        <FeedList filters={filterParams} />
      </Grid>
    </div>
  );
};

export default CategoryPage;
