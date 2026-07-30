"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { DialogProvider } from "./dialog-provider";
import { Toaster } from "sonner";

export function RootProviders({ children }: { children: React.ReactNode }) {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange
    >
      <QueryClientProvider client={queryClient}>
        <DialogProvider>
          {children}
        </DialogProvider>
        <ReactQueryDevtools initialIsOpen={false} />
        <Toaster theme="system" richColors closeButton position="top-right" />
      </QueryClientProvider>
    </NextThemesProvider>
  );
}
