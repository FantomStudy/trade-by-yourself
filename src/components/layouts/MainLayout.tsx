import type { PropsWithChildren } from "react";

import { Hero } from "../ads";
import { Footer } from "./footer/Footer";
import { Header } from "./header/Header";
import { SearchBar } from "./search-bar/SearchBar";

export const MainLayout = ({ children }: PropsWithChildren) => {
  return (
    <>
      <Header />
      <Hero />
      <SearchBar />
      {children}
      <Footer />
    </>
  );
};
