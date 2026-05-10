"use client";

import { environmentManager, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AuthDialogProvider } from "@/components/AuthDialog";
import { AuthProvider, ChatSocketProvider } from "@/lib/contexts";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        retry: false,
        throwOnError: (error) => {
          console.log("[QUERY_ERROR] Ошибка запроса:", error);
          return false;
        },
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

function getQueryClient() {
  if (environmentManager.isServer()) {
    return makeQueryClient();
  } else {
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

export const Providers = ({ children }: { children: React.ReactNode }) => {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthDialogProvider>
        <AuthProvider>
          <ChatSocketProvider>{children}</ChatSocketProvider>
        </AuthProvider>
      </AuthDialogProvider>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
};
