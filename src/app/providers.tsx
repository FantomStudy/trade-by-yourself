"use client";

import { dehydrate, HydrationBoundary, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import { AuthProvider, ChatSocketProvider } from "@/lib/contexts";
import { getQueryClient } from "@/lib/get-query-client";

interface ProvidersProps {
  children: React.ReactNode;
}

export const Providers = ({ children }: ProvidersProps) => {
  const queryClient = getQueryClient();

  return (
    <NuqsAdapter>
      <QueryClientProvider client={queryClient}>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <AuthProvider>
            <ChatSocketProvider>{children}</ChatSocketProvider>
          </AuthProvider>

          <ReactQueryDevtools />
        </HydrationBoundary>
      </QueryClientProvider>
    </NuqsAdapter>
  );
};
