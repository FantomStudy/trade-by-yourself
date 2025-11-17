import React from "react";

import { Toaster } from "@/components/ui";

import { Footer } from "./footer";
import { Header } from "./header";

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Toaster />
      <Footer />
    </>
  );
};
