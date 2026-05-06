import { ProductGrid } from "@/components/ProductGrid";
import { FeedCard, FeedList } from "./_components/FeedList";
import { getFeed } from "./_lib/getFeed";

const CatalogPage = async ({ searchParams }: PageProps<"/">) => {
  const filters = await searchParams;
  const initialItems = await getFeed({ ...filters, page: 1 });

  return (
    <ProductGrid>
      {initialItems.map((item) => (
        <FeedCard key={item.key} item={item} />
      ))}
      <FeedList filters={filters} />
    </ProductGrid>
  );
};

export default CatalogPage;
