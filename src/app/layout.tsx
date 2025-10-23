import type { Metadata } from "next";
import type { PropsWithChildren } from "react";

import { Montserrat } from "next/font/google";

import { ModalProvider } from "@/shared/providers";

import { Footer, Header, HeroBanner, SearchBar } from "./_components";

import "./_styles/globals.css";
import "./_styles/utils.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  weight: ["400", "500", "600", "700"],
  subsets: ["cyrillic"],
});

export const metadata: Metadata = {
  title: "ТоргуйСам",
  description: "",
};

const RootLayout = ({ children }: Readonly<PropsWithChildren>) => {
  return (
    <html lang="ru">
      <body className={montserrat.variable}>
        <ModalProvider>
          <Header />
          <HeroBanner />
          <SearchBar />
          <main>
            <div className="container">{children}</div>
          </main>
          <Footer />
        </ModalProvider>
      </body>
    </html>
  );
};

export default RootLayout;
