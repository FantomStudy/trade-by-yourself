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
import { ProductFeed } from "../_features/feed";
import { safe } from "../_lib/utils/safe";
import styles from "./page.module.css";

const Page = async ({ params }: PageProps<"/[categorySlug]">) => {
  const { categorySlug } = await params;

  const request = await safe(getCategory(categorySlug));

  if (request.success === false) {
    if (request.status === 404) return notFound();
    return <div>Ошибка загрузки категории</div>;
  }

  const category = request.data;

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
            <BreadcrumbPage>{category.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <ProductFeed filters={{ categorySlug }} />
    </>
  );
};

export default Page;
