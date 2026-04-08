import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Sonner } from "@/components/ui";
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
      <body className={`${montserrat.variable} layout`}>
        <Providers>
          <Header />
          <div className="content">{children}</div>
          <Footer />
          <Sonner />
        </Providers>
      </body>
    </html>
  );
};

export default RootLayout;
