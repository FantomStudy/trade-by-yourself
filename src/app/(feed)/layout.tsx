import type { ReactNode } from "react";

import { Hero } from "@/features/ads";
import { SearchBar } from "@/features/products";

interface FeedLayoutProps {
  children: ReactNode;
}

const FeedLayout = ({ children }: FeedLayoutProps) => {
  return (
    <>
      <Hero />
      <SearchBar />
      {children}
    </>
  );
};

export default FeedLayout;
