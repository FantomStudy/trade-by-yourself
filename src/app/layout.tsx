import type { Metadata } from "next";
import type { PropsWithChildren } from "react";

import { Montserrat } from "next/font/google";

import { MainLayout } from "@/components/layout";

import Providers from "./providers";

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

export default function RootLayout({ children }: Readonly<PropsWithChildren>) {
  return (
    <html lang="en">
      <body className={montserrat.variable}>
        <Providers>
          <MainLayout>{children}</MainLayout>
        </Providers>
      </body>
    </html>
  );
}
