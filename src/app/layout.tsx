import type { Metadata } from "next";

import { Montserrat } from "next/font/google";

import { CURRENT_USER_QUERY_KEY } from "@/api/hooks";
import { getCurrentUser } from "@/api/requests";
import { getQueryClient } from "@/lib/get-query-client";
import { cn } from "@/lib/utils";

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
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: CURRENT_USER_QUERY_KEY,
    queryFn: getCurrentUser,
  });

  return (
    <html lang="en">
      <body className={cn(montserrat.variable, "antialiased")}>
        <Providers>
          <MainLayout>{children}</MainLayout>
        </Providers>
      </body>
    </html>
  );
};

export default RootLayout;
