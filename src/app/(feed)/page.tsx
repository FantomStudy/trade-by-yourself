"use client";
import { useState } from "react";

import { FeedWrapper } from "@/components/feed-wrapper";
import { Product } from "@/types/product";

import { HeroBanner, Search } from "./_components";

const HomePage = () => {
  const [products, setProducts] = useState<Product[]>([]);

  return (
    <>
      <HeroBanner />
      <div className="global-container">
        <Search setProducts={setProducts} />
        <FeedWrapper products={products} />
      </div>
    </>
  );
};

export default HomePage;
