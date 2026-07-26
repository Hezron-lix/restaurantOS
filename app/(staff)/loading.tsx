export default function StaffLoading() {
  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 animate-pulse">
      <div className="mb-8 space-y-2">
        <div className="h-8 bg-zinc-800 rounded w-1/4"></div>
        <div className="h-4 bg-zinc-800/50 rounded w-1/3"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="h-24 bg-zinc-800/50 rounded-xl border border-white/5"></div>
        <div className="h-24 bg-zinc-800/50 rounded-xl border border-white/5"></div>
        <div className="h-24 bg-zinc-800/50 rounded-xl border border-white/5"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2 h-96 bg-zinc-800/30 rounded-xl border border-white/5"></div>
        <div className="space-y-6">
          <div className="h-48 bg-zinc-800/30 rounded-xl border border-white/5"></div>
          <div className="h-48 bg-zinc-800/30 rounded-xl border border-white/5"></div>
        </div>
      </div>
    </div>
  );
}
