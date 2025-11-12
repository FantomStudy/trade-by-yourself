"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { TailwindIndicator } from "@/components/dev";
import { AuthProvider } from "@/lib/contexts";
import { getQueryClient } from "@/lib/get-query-client";

interface ProvidersProps {
  children: React.ReactNode;
}

export const Providers = ({ children }: ProvidersProps) => {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {children}
        <TailwindIndicator />
        <ReactQueryDevtools />
      </AuthProvider>
    </QueryClientProvider>
  );
};
