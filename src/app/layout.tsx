import type { Metadata } from "next";
import type { PropsWithChildren } from "react";

import { Montserrat } from "next/font/google";

import { MainLayout } from "@/components/layouts";

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
        <MainLayout>{children}</MainLayout>
      </body>
    </html>
  );
}
