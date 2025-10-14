import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { Footer, Header, HeroBanner, SearchBar } from "@/components/business";
import { PropsWithChildren } from "react";

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
        <Header />
        <HeroBanner />
        <SearchBar />

        <main>
          <div className="container">{children}</div>
        </main>

        <Footer />
      </body>
    </html>
  );
};

export default RootLayout;
