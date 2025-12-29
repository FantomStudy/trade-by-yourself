import Link from "next/link";
import { notFound } from "next/navigation";

import { getCategoryBySlug } from "../_features/category";
import { ProductFeed } from "../_features/feed";
import { Breadcrumb } from "../_lib/ui/breadcrumb";
import { safe } from "../_lib/utils/safe";

import styles from "./page.module.css";

const Page = async ({ params }: PageProps<"/[categorySlug]">) => {
  const { categorySlug } = await params;

  const request = await safe(getCategoryBySlug(categorySlug));

  if (request.success === false) {
    if (request.status === 404) return notFound();
    return <div>Ошибка загрузки категории</div>;
  }

  const category = request.data;

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
            <Breadcrumb.Page>{category.name}</Breadcrumb.Page>
          </Breadcrumb.Item>
        </Breadcrumb.List>
      </Breadcrumb>

      <ProductFeed filters={{ categoryId: category.id }} />
    </>
  );
};

export default Page;
