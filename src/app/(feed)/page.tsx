"use client";
import { useState } from "react";

import { FeedWrapper } from "@/components/feed-wrapper";

import { HeroBanner, Search } from "./_components";

const HomePage = () => {
  const [products, setProducts] = useState([]);

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
