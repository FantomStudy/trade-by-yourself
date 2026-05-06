import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Sonner } from "@/components/ui/Sonner";
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

const RootLayout = async ({ children }: LayoutProps<"/">) => {
  return (
    <html lang="ru">
      <body className={montserrat.variable} suppressHydrationWarning>
        <Providers>
          <Header />
          <main>{children}</main>
          <Footer />
          <Sonner />
        </Providers>
      </body>
    </html>
  );
};

export default RootLayout;
