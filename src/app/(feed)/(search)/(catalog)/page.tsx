import { getBanners } from "@/api/banners/getBanners";
import { getProducts } from "@/api/products/getProducts";
import { FeedList, FeedListItem, PRODUCT_PAGE_LIMIT } from "@/components/FeedList";
import { Grid } from "@/components/ui/Grid";
import { mergeFeed } from "@/lib/mergeFeed";

const CatalogPage = async ({ searchParams }: PageProps<"/">) => {
  const filters = await searchParams;

  const [products, narrowBanners, wideBanners] = await Promise.all([
    getProducts({ ...filters, page: 1, limit: PRODUCT_PAGE_LIMIT }),
    getBanners({ place: "PRODUCT_FEED" }),
    getBanners({ place: "PROFILE" }),
  ]);

  const merged = mergeFeed({ products, narrowBanners, wideBanners });

  return (
    <Grid>
      {merged.map((item) => (
        <FeedListItem key={item.key} item={item} />
      ))}
      <FeedList filters={filters} />
    </Grid>
  );
};

export default CatalogPage;
