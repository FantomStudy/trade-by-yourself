import { Suspense } from "react";

import { getUserInfo } from "@/api/requests";

import { SellerInfo, SellerProductFeed } from "./_components";

import styles from "./page.module.css";

const SellerPage = async ({ params }: PageProps<"/seller/[sellerId]">) => {
  const { sellerId } = await params;
  const sellerInfo = await getUserInfo(Number(sellerId));

  return (
    <div className="global-container">
      <div className={styles.container}>
        <aside className={styles.aside}>
          <SellerInfo seller={sellerInfo} />
        </aside>

        <div className={styles.content}>
          <Suspense fallback={<div>Загрузка...</div>}>
            <SellerProductFeed sellerId={Number(sellerId)} />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default SellerPage;
