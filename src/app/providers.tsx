"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { ChatSocketProvider } from "@/lib/contexts";
import { getQueryClient } from "@/lib/getQueryClient";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  const queryClient = getQueryClient();

  return (
    <NuqsAdapter>
      <QueryClientProvider client={queryClient}>
        <ChatSocketProvider>{children}</ChatSocketProvider>
        <ReactQueryDevtools />
      </QueryClientProvider>
    </NuqsAdapter>
  );
};
