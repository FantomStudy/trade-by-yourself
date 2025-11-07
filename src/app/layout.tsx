import type { Metadata } from "next";
import type { ReactNode } from "react";

import { Montserrat } from "next/font/google";

import { getCurrentUser } from "@/lib/api";

import { Footer, Header } from "./_components";
import { Providers } from "./providers";

import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  weight: ["400", "500", "600", "700"],
  subsets: ["cyrillic"],
});

export const metadata: Metadata = {
  title: "ТоргуйСам",
  description: "",
};

interface RootLayoutProps {
  children: ReactNode;
}

const RootLayout = async ({ children }: RootLayoutProps) => {
  const user = await getCurrentUser();

  return (
    <html lang="en">
      <body className={montserrat.variable}>
        <Providers user={{ initialUser: user }}>
          <Header />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
};

export default RootLayout;
