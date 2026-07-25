"use client";

import { ReactNode, Suspense } from "react";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";
import { Loader2 } from "lucide-react";

interface WorkspaceProps {
  children: ReactNode;
}

/**
 * The main application workspace.
 * Wraps feature modules in Suspense and Error Boundaries to prevent global crashes.
 * Enforces consistent padding and scroll behavior across all authenticated views.
 */
export function Workspace({ children }: WorkspaceProps) {
  return (
    <main className="flex-1 overflow-auto bg-zinc-950 p-4 md:p-6 lg:p-8">
      <div className="max-w-screen-2xl mx-auto h-full flex flex-col">
        <ErrorBoundary>
          <Suspense fallback={<WorkspaceLoadingState />}>
            {children}
          </Suspense>
        </ErrorBoundary>
      </div>
    </main>
  );
}

function WorkspaceLoadingState() {
  return (
    <div className="flex-1 flex items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center text-text-muted">
        <Loader2 className="h-8 w-8 animate-spin mb-4 text-brand" />
        <p className="text-sm font-medium animate-pulse">Loading workspace...</p>
      </div>
    </div>
  );
}
