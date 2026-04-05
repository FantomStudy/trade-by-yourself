import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { Sonner } from "@/components/ui/Sonner";
import { MainLayout } from "./_components";
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

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="ru">
      <body className={montserrat.variable}>
        <Providers>
          <MainLayout>{children}</MainLayout>
          <Sonner />
        </Providers>
      </body>
    </html>
  );
};

export default RootLayout;
