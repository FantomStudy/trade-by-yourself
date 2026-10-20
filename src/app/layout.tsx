import type { Metadata } from "next";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { MobileTabs } from "@/components/layout/MobileTabs";
import { Sonner } from "@/components/ui/Sonner";
import { Providers } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Торгуй сам",
  description: "Сайт для продажи вещей",
};

const RootLayout = async ({ children }: LayoutProps<"/">) => {
  return (
    <html lang="ru">
      <body suppressHydrationWarning>
        <Providers>
          <Header />
          <main>{children}</main>
          <Footer />
          <MobileTabs />
          <Sonner />
        </Providers>
      </body>
    </html>
  );
};

export default RootLayout;
