import { Grid } from "@/components/ui";
import { FeedCard, FeedList, PRODUCT_PAGE_LIMIT } from "./_components/FeedList";
import { getFeed } from "./_lib/feed";

const CatalogPage = async ({ searchParams }: PageProps<"/">) => {
  const filters = await searchParams;
  const initialItems = await getFeed({ ...filters, page: 1, limit: PRODUCT_PAGE_LIMIT });

  return (
    <Grid>
      {initialItems.map((item) => (
        <FeedCard key={item.key} item={item} />
      ))}
      <FeedList filters={filters} />
    </Grid>
  );
};

export default CatalogPage;
