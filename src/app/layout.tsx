import type { Metadata } from "next";

import { CURRENT_USER_QUERY_KEY } from "@/api/hooks";
import { getCurrentUserOrNull } from "@/api/requests";
import { getQueryClient } from "@/lib/get-query-client";

import { MainLayout } from "./_components";
import { Providers } from "./providers";

import "./globals.css";

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
    <html lang="en">
      <body suppressHydrationWarning>
        <Providers>
          <MainLayout>{children}</MainLayout>
        </Providers>
      </body>
    </html>
  );
};

export default RootLayout;
