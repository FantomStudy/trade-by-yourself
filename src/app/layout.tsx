import type { Metadata } from "next";

import { Montserrat } from "next/font/google";

import { MainLayout } from "./_components/MainLayout";
import { Providers } from "./providers";

import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  weight: ["400", "500", "600", "700"],
  subsets: ["cyrillic"],
});

export const metadata: Metadata = {
  title: "Торгуй сам",
  description: "Сайт для продажи вещей",
};

const RootLayout = ({ children }: React.PropsWithChildren) => {
  return (
    <html lang="en">
      <body className={montserrat.variable}>
        <Providers>
          <MainLayout>{children}</MainLayout>
        </Providers>
      </body>
    </html>
  );
};

export default RootLayout;
