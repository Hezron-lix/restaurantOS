import { SequenceHero } from "@/components/landing/sequence-hero";
import { InView } from "@/components/ui/in-view";
import { Tilt } from "@/components/ui/tilt-card";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, ChefHat, BarChart3, BrainCircuit, LayoutDashboard, Activity, DollarSign } from "lucide-react";
import { Footer } from "@/components/landing/footer";
import { Navbar } from "@/components/landing/navbar";

export default function PublicPage() {
  return (
    <div className="bg-black min-h-screen text-zinc-50 selection:bg-brand selection:text-white">
      <Navbar />

      <main>
        {/* The pinned GSAP canvas hero */}
        <SequenceHero />

        {/* Section: QR Ordering */}
        <section id="operations" className="py-48 md:py-64 relative z-20 bg-black overflow-hidden transition-colors duration-1000">
          {/* Subtle ambient lighting */}
          <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-[radial-gradient(circle_at_center,rgba(234,179,8,0.04)_0%,transparent_70%)] pointer-events-none animate-ambient-shift origin-center" />

          <div className="container mx-auto max-w-7xl px-6 md:px-16 grid grid-cols-1 md:grid-cols-2 gap-24 items-center">
            <InView
              viewOptions={{ margin: "-30%" }}
              variants={{
                hidden: { opacity: 0, x: -40, filter: "blur(4px)" },
                visible: { opacity: 1, x: 0, filter: "blur(0px)" }
              }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800/50 flex items-center justify-center mb-10 shadow-[0_0_30px_rgba(234,179,8,0.05)] animate-float">
                <LayoutDashboard className="size-6 text-brand animate-pulse-slow" />
              </div>
              <h2 className="text-5xl md:text-7xl font-medium tracking-tight mb-8 leading-[1.1]">
                Frictionless <br />
                <span className="text-zinc-600">operations.</span>
              </h2>
              <p className="text-xl text-zinc-400 max-w-md font-light leading-relaxed">
                The entire restaurant team operates from a single, unified dashboard. Orders, tables, staff, and analytics stay perfectly synchronized. No switching between fragmented systems—just real-time clarity across the floor.
              </p>
            </InView>
            <div className="flex justify-center md:justify-end relative">
              {/* Glow behind the card */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-brand/10 blur-[100px] rounded-full pointer-events-none transition-all duration-1000 animate-pulse-slow" />

              <div className="w-full max-w-lg animate-float-reverse">
                <Tilt rotationFactor={3} className="w-full relative z-10 group">
                  <GlassCard className="aspect-[4/3] p-6 border-zinc-800/60 bg-zinc-900/40 backdrop-blur-2xl flex flex-col relative overflow-hidden shadow-2xl transition-all duration-700 ease-out group-hover:-translate-y-2 group-hover:shadow-[0_20px_60px_-15px_rgba(234,179,8,0.2)] rounded-3xl">
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                    <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-brand/5 to-transparent blur-2xl pointer-events-none animate-breathe" />

                    {/* Dashboard Mockup */}
                    <div className="flex items-center justify-between mb-6 relative z-10 border-b border-zinc-800/50 pb-4">
                      <div className="flex items-center gap-3">
                        <div className="size-8 rounded-full bg-brand/20 flex items-center justify-center">
                          <LayoutDashboard className="size-4 text-brand" />
                        </div>
                        <div className="h-4 w-32 bg-zinc-800 rounded-full" />
                      </div>
                      <div className="flex gap-2">
                        <div className="size-8 rounded-full bg-zinc-800/80" />
                        <div className="size-8 rounded-full bg-zinc-800/80 animate-breathe" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 relative z-10 mb-4">
                      <div className="bg-zinc-800/30 rounded-2xl p-4 border border-zinc-800/50">
                        <div className="flex items-center gap-2 mb-3">
                          <Activity className="size-4 text-emerald-400" />
                          <div className="h-3 w-16 bg-zinc-700 rounded-full" />
                        </div>
                        <div className="text-2xl font-medium text-zinc-200">12 Active</div>
                        <div className="mt-2 w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                          <div className="bg-emerald-400 w-2/3 h-full animate-pulse-slow" />
                        </div>
                      </div>
                      <div className="bg-zinc-800/30 rounded-2xl p-4 border border-zinc-800/50">
                        <div className="flex items-center gap-2 mb-3">
                          <DollarSign className="size-4 text-brand" />
                          <div className="h-3 w-20 bg-zinc-700 rounded-full" />
                        </div>
                        <div className="text-2xl font-medium text-zinc-200">$4,250</div>
                        <div className="mt-2 flex items-center gap-2">
                          <div className="text-xs text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">+14%</div>
                          <div className="text-xs text-zinc-500">vs yesterday</div>
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 bg-zinc-800/30 rounded-2xl border border-zinc-800/50 p-4 relative z-10 flex flex-col gap-3">
                      <div className="h-3 w-24 bg-zinc-700 rounded-full mb-1" />
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/50 border border-zinc-800/50">
                          <div className="flex items-center gap-3">
                            <div className="size-8 rounded-lg bg-zinc-800" />
                            <div className="space-y-1.5">
                              <div className="h-2.5 w-20 bg-zinc-700 rounded-full" />
                              <div className="h-2 w-12 bg-zinc-800 rounded-full" />
                            </div>
                          </div>
                          <div className="h-6 w-16 bg-brand/10 border border-brand/20 rounded-full" />
                        </div>
                      ))}
                    </div>
                  </GlassCard>
                </Tilt>
              </div>
            </div>
          </div>
        </section>

        {/* Section: Kitchen */}
        <section className="py-48 md:py-64 relative z-20 bg-zinc-950 border-y border-zinc-900/50 overflow-hidden transition-colors duration-1000">
          {/* Subtle ambient lighting */}
          <div className="absolute top-1/2 left-0 w-[1200px] h-[1200px] -translate-y-1/2 -translate-x-1/3 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.04)_0%,transparent_70%)] pointer-events-none animate-ambient-shift origin-center" style={{ animationDelay: '-15s' }} />

          <div className="container mx-auto max-w-7xl px-6 md:px-16 grid grid-cols-1 md:grid-cols-2 gap-24 items-center">
            <div className="order-2 md:order-1 flex justify-center md:justify-start relative">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-amber-500/10 blur-[100px] rounded-full pointer-events-none animate-pulse-slow" />

              <div className="w-full max-w-lg animate-float">
                <Tilt rotationFactor={3} isReverse className="w-full relative z-10 group">
                  <GlassCard className="aspect-[4/3] p-5 border-zinc-800/60 bg-zinc-950/80 backdrop-blur-2xl flex flex-col relative overflow-hidden shadow-2xl transition-all duration-700 ease-out group-hover:-translate-y-2 group-hover:shadow-[0_20px_60px_-15px_rgba(245,158,11,0.2)] rounded-3xl">
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(245,158,11,0.08)_0%,transparent_70%)] animate-breathe" />

                    {/* KDS Header */}
                    <div className="flex items-center justify-between mb-4 relative z-10">
                      <div className="h-3 w-20 bg-zinc-800 rounded-full" />
                      <div className="flex gap-2">
                        <div className="h-6 w-16 bg-amber-500/20 text-amber-500 text-[10px] font-medium rounded-md flex items-center justify-center border border-amber-500/30">AVG 12M</div>
                      </div>
                    </div>

                    {/* KDS Columns */}
                    <div className="grid grid-cols-3 gap-3 h-full relative z-10">
                      {/* New */}
                      <div className="bg-zinc-900/50 rounded-xl p-2 border border-zinc-800/40 flex flex-col gap-2">
                        <div className="flex items-center justify-between px-1 mb-1">
                          <div className="h-2 w-10 bg-zinc-600 rounded-full" />
                          <div className="size-4 rounded-full bg-zinc-800 flex items-center justify-center text-[8px] text-zinc-400">3</div>
                        </div>
                        <div className="bg-zinc-800/80 rounded-lg p-2 border border-zinc-700/50 shadow-sm">
                          <div className="flex justify-between items-start mb-2">
                            <div className="h-2.5 w-12 bg-zinc-400 rounded-sm" />
                            <div className="size-3 bg-red-400/20 rounded-sm" />
                          </div>
                          <div className="space-y-1.5">
                            <div className="h-1.5 w-full bg-zinc-700 rounded-sm" />
                            <div className="h-1.5 w-4/5 bg-zinc-700 rounded-sm" />
                          </div>
                        </div>
                      </div>

                      {/* Prep */}
                      <div className="bg-zinc-900/50 rounded-xl p-2 border border-zinc-800/40 flex flex-col gap-2 relative">
                        <div className="absolute inset-0 bg-amber-500/5 rounded-xl animate-pulse-slow pointer-events-none" />
                        <div className="flex items-center justify-between px-1 mb-1 relative z-10">
                          <div className="h-2 w-12 bg-amber-500/80 rounded-full" />
                          <div className="size-4 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center text-[8px]">2</div>
                        </div>
                        <div className="bg-zinc-800/80 rounded-lg p-2 border border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.1)] relative z-10 group-hover:-translate-y-1 transition-transform duration-500">
                          <div className="flex justify-between items-start mb-2">
                            <div className="h-2.5 w-14 bg-amber-400/80 rounded-sm" />
                            <div className="text-[8px] text-amber-400 font-mono">08:42</div>
                          </div>
                          <div className="space-y-1.5">
                            <div className="h-1.5 w-full bg-zinc-600 rounded-sm" />
                            <div className="h-1.5 w-full bg-zinc-600 rounded-sm" />
                            <div className="h-1.5 w-3/5 bg-zinc-600 rounded-sm" />
                          </div>
                          <div className="mt-2 pt-2 border-t border-zinc-700/50 flex gap-1">
                            <div className="h-1 flex-1 bg-amber-500/40 rounded-full overflow-hidden">
                              <div className="h-full w-2/3 bg-amber-500 rounded-full" />
                            </div>
                          </div>
                        </div>
                        <div className="bg-zinc-800/50 rounded-lg p-2 border border-zinc-700/30 opacity-70 relative z-10">
                          <div className="h-2.5 w-10 bg-zinc-500 rounded-sm mb-2" />
                          <div className="h-1.5 w-full bg-zinc-700 rounded-sm mb-1.5" />
                          <div className="h-1.5 w-1/2 bg-zinc-700 rounded-sm" />
                        </div>
                      </div>

                      {/* Ready */}
                      <div className="bg-zinc-900/50 rounded-xl p-2 border border-zinc-800/40 flex flex-col gap-2">
                        <div className="flex items-center justify-between px-1 mb-1">
                          <div className="h-2 w-12 bg-emerald-500/60 rounded-full" />
                          <div className="size-4 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center text-[8px]">1</div>
                        </div>
                        <div className="bg-zinc-800/40 rounded-lg p-2 border border-emerald-500/20">
                          <div className="flex justify-between items-start mb-2">
                            <div className="h-2.5 w-12 bg-emerald-400/60 rounded-sm" />
                            <div className="size-3 bg-emerald-400/20 rounded-sm" />
                          </div>
                          <div className="h-1.5 w-full bg-zinc-700/50 rounded-sm mb-1.5" />
                          <div className="h-1.5 w-2/3 bg-zinc-700/50 rounded-sm" />
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                </Tilt>
              </div>
            </div>
            <InView className="order-1 md:order-2" viewOptions={{ margin: "-30%" }} variants={{
              hidden: { opacity: 0, x: 40, filter: "blur(4px)" },
              visible: { opacity: 1, x: 0, filter: "blur(0px)" }
            }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}>
              <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800/50 flex items-center justify-center mb-10 shadow-[0_0_30px_rgba(245,158,11,0.05)] animate-float-reverse">
                <ChefHat className="size-6 text-amber-500 animate-pulse-slow" />
              </div>
              <h2 className="text-5xl md:text-7xl font-medium tracking-tight mb-8 leading-[1.1]">
                The kitchen <br />
                <span className="text-zinc-600">orchestrates.</span>
              </h2>
              <p className="text-xl text-zinc-400 max-w-md font-light leading-relaxed">
                Orders stream directly into the Kitchen Display System without friction. Preparation statuses remain highly visible, and priorities are organized dynamically. The entire back-of-house stays perfectly synchronized—no paper tickets, no chaos.
              </p>
            </InView>
          </div>
        </section>

        {/* Section: Analytics & AI */}
        <section id="features" className="py-48 md:py-64 relative z-20 bg-black overflow-hidden transition-colors duration-1000">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1400px] h-[700px] bg-[radial-gradient(ellipse_at_bottom_center,rgba(16,185,129,0.06)_0%,transparent_70%)] pointer-events-none animate-ambient-shift origin-bottom" style={{ animationDelay: '-10s' }} />

          <div className="container mx-auto max-w-7xl px-6 md:px-16 text-center">
            {/* The AI Orb */}
            <InView viewOptions={{ margin: "-30%" }} variants={{ hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1 } }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}>
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-zinc-900 border border-emerald-500/20 mb-14 shadow-[0_0_40px_rgba(16,185,129,0.2)] animate-breathe relative mx-auto">
                <div className="absolute inset-0 rounded-3xl bg-emerald-500/5 animate-pulse-slow blur-md" />
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-emerald-500/10 to-transparent animate-orb-spin" />
                <BrainCircuit className="size-8 text-emerald-500 relative z-10 animate-pulse-slow" />
              </div>
            </InView>

            <h2 className="text-6xl md:text-8xl font-medium tracking-tight mb-10 leading-[1.1]">
              <InView className="inline-block" viewOptions={{ margin: "-30%", once: false }} variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}>
                Intelligence <br />
              </InView>
              <InView className="inline-block text-zinc-700" viewOptions={{ margin: "-30%", once: false }} variants={{
                hidden: { opacity: 0, y: 30, scale: 0.96, filter: "blur(8px)" },
                visible: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }
              }} transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}>
                emerges.
              </InView>
            </h2>

            <div className="text-2xl text-zinc-400 max-w-3xl mx-auto font-light leading-relaxed mb-24 flex flex-col gap-4">
              <InView viewOptions={{ margin: "-30%" }} variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
                Restaurant Copilot understands your operational data on a fundamental level.
              </InView>
              <InView viewOptions={{ margin: "-30%" }} variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }} transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}>
                Ask natural language questions to uncover insights and spot subtle trends instantly.
              </InView>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto text-left relative z-10">
              {[
                { icon: BarChart3, title: "Deep Analytics", desc: "Granular insights into every transaction." },
                { icon: BrainCircuit, title: "Operational Intelligence", desc: "Natural language insights across your restaurant." },
                { icon: LayoutDashboard, title: "Operations Hub", desc: "A single dashboard to control the entire floor." }
              ].map((feature, i) => (
                <InView key={i} viewOptions={{ margin: "-30%" }} variants={{ hidden: { opacity: 0, y: 30, scale: 0.98 }, visible: { opacity: 1, y: 0, scale: 1 } }} transition={{ duration: 0.9, delay: (i * 0.15), ease: [0.16, 1, 0.3, 1] }}>
                  <div className="animate-float h-full" style={{ animationDelay: `${i * -4}s` }}>
                    <Tilt rotationFactor={3} className="w-full h-full">
                      <GlassCard className="p-10 bg-zinc-900/20 border-zinc-800/40 backdrop-blur-xl transition-all duration-700 ease-out hover:bg-zinc-900/40 hover:border-zinc-700/50 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(16,185,129,0.2)] group h-full cursor-default overflow-hidden relative">
                        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                        <feature.icon className="size-8 text-zinc-400 mb-6 transition-colors duration-500 group-hover:text-emerald-500 relative z-10" />
                        <h4 className="text-xl text-zinc-100 font-medium mb-3 relative z-10">{feature.title}</h4>
                        <p className="text-base text-zinc-500 font-light leading-relaxed relative z-10">{feature.desc}</p>
                      </GlassCard>
                    </Tilt>
                  </div>
                </InView>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-48 md:py-64 relative z-20 bg-zinc-950 border-t border-zinc-900/50">
          <div className="container mx-auto max-w-4xl px-6 md:px-16 text-center">
            <InView viewOptions={{ margin: "-30%" }} variants={{
              hidden: { opacity: 0, y: 24, filter: "blur(4px)" },
              visible: { opacity: 1, y: 0, filter: "blur(0px)" }
            }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}>
              <h2 className="text-5xl md:text-6xl font-medium tracking-tight mb-8">
                Run your restaurant.
              </h2>
              <p className="text-2xl text-zinc-400 font-light mb-16 animate-pulse-slow">
                One dashboard. One platform. Complete operational visibility.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <Link href="/register" className="w-full sm:w-auto">
                  <Button size="lg" className="glow-brand group text-lg h-14 px-10 w-full sm:w-auto text-white shadow-[0_0_30px_rgba(234,179,8,0.15)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_15px_40px_-5px_rgba(234,179,8,0.4)] active:scale-95 active:shadow-[0_0_20px_rgba(234,179,8,0.2)] animate-breathe">
                    Get Started
                    <ArrowRight className="ml-3 size-5 transition-transform duration-500 ease-out group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>
            </InView>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
