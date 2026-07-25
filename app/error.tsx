"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Route segment error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[400px] w-full p-8 text-center">
      <div className="bg-red-500/10 p-4 rounded-full mb-6">
        <AlertTriangle className="w-12 h-12 text-red-500" />
      </div>
      <h2 className="text-2xl font-semibold mb-2">Something went wrong!</h2>
      <p className="text-zinc-400 mb-8 max-w-md">
        We encountered a problem loading this section of RestaurantOS.
      </p>
      <Button onClick={() => reset()} className="bg-brand text-brand-foreground hover:bg-brand/90 px-8 h-12">
        Try again
      </Button>
    </div>
  );
}
