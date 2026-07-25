"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  console.error(error);
  return (
    <html>
      <body className="bg-zinc-950 text-zinc-100 min-h-screen flex items-center justify-center">
        <div className="max-w-md p-8 bg-zinc-900 border border-zinc-800 rounded-2xl text-center shadow-2xl">
          <h2 className="text-xl font-bold text-red-500 mb-4">Critical System Error</h2>
          <p className="text-sm text-zinc-400 mb-6">
            RestaurantOS encountered a critical error. Please refresh the page.
          </p>
          <button 
            onClick={() => reset()}
            className="w-full h-12 rounded-xl bg-zinc-100 text-zinc-900 font-semibold"
          >
            Recover Session
          </button>
        </div>
      </body>
    </html>
  );
}
