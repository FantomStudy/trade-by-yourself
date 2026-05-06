import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { CURRENT_USER_QUERY_KEY } from "@/api/hooks";
import { getCurrentUserOrNull } from "@/api/requests";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Toaster } from "@/components/ui";
import { getQueryClient } from "@/lib/get-query-client";
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
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: CURRENT_USER_QUERY_KEY,
    queryFn: getCurrentUserOrNull,
  });

  return (
    <html lang="ru">
      <body className={montserrat.variable} suppressHydrationWarning>
        <Providers>
          <Header />
          <main>{children}</main>
          <Footer />
          <Toaster />
        </Providers>
      </body>
    </html>
  );
};

export default RootLayout;
