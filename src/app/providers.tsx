"use client";

import {
  dehydrate,
  HydrationBoundary,
  QueryClientProvider,
} from "@tanstack/react-query";

import { AuthProvider } from "@/lib/contexts";
import { getQueryClient } from "@/lib/get-query-client";

import { DevTools } from "./_components";

interface ProvidersProps {
  children: React.ReactNode;
}

export const Providers = ({ children }: ProvidersProps) => {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <AuthProvider>
          {children}
          <DevTools />
        </AuthProvider>
      </HydrationBoundary>
    </QueryClientProvider>
  );
};
