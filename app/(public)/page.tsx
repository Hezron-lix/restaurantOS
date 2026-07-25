import { SequenceHero } from "@/components/landing/sequence-hero";
import { InView } from "@/components/ui/in-view";
import { Tilt } from "@/components/ui/tilt-card";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, QrCode, ChefHat, BarChart3, BrainCircuit } from "lucide-react";
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
        <section className="py-48 md:py-64 relative z-20 bg-black overflow-hidden transition-colors duration-1000">
          {/* Subtle ambient lighting */}
          <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-[radial-gradient(circle_at_center,rgba(234,179,8,0.04)_0%,transparent_70%)] pointer-events-none animate-ambient-shift origin-center" />
          
          <div className="container mx-auto max-w-7xl px-6 md:px-16 grid grid-cols-1 md:grid-cols-2 gap-24 items-center">
            <InView variants={{
              hidden: { opacity: 0, y: 24, filter: "blur(4px)" },
              visible: { opacity: 1, y: 0, filter: "blur(0px)" }
            }} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}>
              <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800/50 flex items-center justify-center mb-10 shadow-[0_0_30px_rgba(234,179,8,0.05)] animate-float">
                <QrCode className="size-6 text-brand animate-pulse-slow" />
              </div>
              <h2 className="text-5xl md:text-7xl font-medium tracking-tight mb-8 leading-[1.1]">
                Frictionless <br/>
                <span className="text-zinc-600">ordering.</span>
              </h2>
              <p className="text-xl text-zinc-400 max-w-md font-light leading-relaxed">
                Guests tap their phone and the menu appears instantly. No apps. No waiting. Just a seamless bridge between desire and the kitchen.
              </p>
            </InView>
            <div className="flex justify-center md:justify-end relative">
              {/* Glow behind the card */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-brand/10 blur-[100px] rounded-full pointer-events-none transition-all duration-1000 animate-pulse-slow" />
              
              <div className="w-full max-w-sm animate-float-reverse">
                <Tilt rotationFactor={5} className="w-full relative z-10 group">
                  <GlassCard className="aspect-[9/16] p-8 border-zinc-800/60 bg-zinc-900/40 backdrop-blur-2xl flex flex-col relative overflow-hidden shadow-2xl transition-all duration-700 ease-out group-hover:-translate-y-2 group-hover:shadow-[0_20px_60px_-15px_rgba(234,179,8,0.2)]">
                    {/* Subtle glass reflection */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                    <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-brand/5 to-transparent blur-2xl pointer-events-none animate-breathe" />
                    
                    <div className="flex items-center justify-between mb-10 relative z-10">
                      <div className="h-4 w-24 bg-zinc-800 rounded-full animate-pulse-slow" />
                      <div className="size-10 rounded-full bg-zinc-800 animate-breathe" />
                    </div>
                    <div className="space-y-6 relative z-10">
                      <div className="h-28 w-full bg-zinc-800/40 rounded-2xl" />
                      <div className="h-28 w-full bg-zinc-800/40 rounded-2xl" />
                      <div className="h-28 w-full bg-zinc-800/40 rounded-2xl" />
                    </div>
                    <div className="mt-auto h-14 w-full bg-brand rounded-xl opacity-90 shadow-[0_0_20px_rgba(234,179,8,0.2)] relative z-10 animate-pulse-slow" />
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
               {/* Glow behind the card */}
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-amber-500/10 blur-[100px] rounded-full pointer-events-none animate-pulse-slow" />
               
              <div className="w-full max-w-lg animate-float">
                <Tilt rotationFactor={4} isReverse className="w-full relative z-10 group">
                  <div className="aspect-[4/3] p-[1px] rounded-3xl bg-gradient-to-br from-zinc-800/80 to-zinc-900/50 shadow-2xl transition-all duration-700 ease-out group-hover:-translate-y-2 group-hover:shadow-[0_20px_60px_-15px_rgba(245,158,11,0.2)]">
                    <div className="w-full h-full bg-zinc-950/90 backdrop-blur-xl rounded-[23px] flex items-center justify-center border border-zinc-900/50 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(245,158,11,0.08)_0%,transparent_70%)] animate-breathe" />
                      
                      <div className="grid grid-cols-3 gap-4 p-6 w-full h-full relative z-10">
                        {[...Array(6)].map((_, i) => (
                          <div key={i} className={`rounded-xl transition-all duration-1000 ${i === 1 ? 'bg-amber-500/15 border border-amber-500/20 shadow-[inset_0_0_20px_rgba(245,158,11,0.1)] group-hover:bg-amber-500/25 animate-pulse-slow' : 'bg-zinc-900/50 border border-zinc-800/30 group-hover:bg-zinc-800/40'}`} />
                        ))}
                      </div>
                    </div>
                  </div>
                </Tilt>
              </div>
            </div>
            <InView className="order-1 md:order-2" variants={{
              hidden: { opacity: 0, y: 24, filter: "blur(4px)" },
              visible: { opacity: 1, y: 0, filter: "blur(0px)" }
            }} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}>
              <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800/50 flex items-center justify-center mb-10 shadow-[0_0_30px_rgba(245,158,11,0.05)] animate-float-reverse">
                <ChefHat className="size-6 text-amber-500 animate-pulse-slow" />
              </div>
              <h2 className="text-5xl md:text-7xl font-medium tracking-tight mb-8 leading-[1.1]">
                The kitchen <br/>
                <span className="text-zinc-600">orchestrates.</span>
              </h2>
              <p className="text-xl text-zinc-400 max-w-md font-light leading-relaxed">
                Orders flow directly to the digital KDS. Preparation times are tracked. Priorities are dynamically sorted. A quiet, perfectly timed symphony.
              </p>
            </InView>
          </div>
        </section>

        {/* Section: Analytics & AI */}
        <section className="py-48 md:py-64 relative z-20 bg-black overflow-hidden transition-colors duration-1000">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1400px] h-[700px] bg-[radial-gradient(ellipse_at_bottom_center,rgba(16,185,129,0.06)_0%,transparent_70%)] pointer-events-none animate-ambient-shift origin-bottom" style={{ animationDelay: '-10s' }} />
          
          <div className="container mx-auto max-w-7xl px-6 md:px-16 text-center">
            <InView variants={{
              hidden: { opacity: 0, y: 32, scale: 0.98, filter: "blur(6px)" },
              visible: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }
            }} transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}>
              
              {/* The AI Orb */}
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-zinc-900 border border-emerald-500/20 mb-14 shadow-[0_0_40px_rgba(16,185,129,0.2)] animate-breathe relative">
                <div className="absolute inset-0 rounded-3xl bg-emerald-500/5 animate-pulse-slow blur-md" />
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-emerald-500/10 to-transparent animate-orb-spin" />
                <BrainCircuit className="size-8 text-emerald-500 relative z-10 animate-pulse-slow" />
              </div>
              
              <h2 className="text-6xl md:text-8xl font-medium tracking-tight mb-10 leading-[1.1]">
                Intelligence <br/>
                <span className="text-zinc-700">emerges.</span>
              </h2>
              
              <p className="text-2xl text-zinc-400 max-w-3xl mx-auto font-light leading-relaxed mb-24">
                RestaurantOS doesn&apos;t just record data; it understands it. Predicting inventory shortages, suggesting staffing shifts, and identifying peak hour patterns before they happen.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto text-left relative z-10">
                {[
                  { icon: BarChart3, title: "Deep Analytics", desc: "Granular insights into every transaction." },
                  { icon: BrainCircuit, title: "Predictive AI", desc: "Machine learning models forecasting demand." },
                  { icon: ChefHat, title: "Operations Hub", desc: "A single dashboard to control the entire floor." }
                ].map((feature, i) => (
                  <div key={i} className="animate-float" style={{ animationDelay: `${i * -4}s` }}>
                    <Tilt rotationFactor={3} className="w-full">
                      <GlassCard className="p-10 bg-zinc-900/20 border-zinc-800/40 backdrop-blur-xl transition-all duration-700 ease-out hover:bg-zinc-900/40 hover:border-zinc-700/50 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(16,185,129,0.2)] group h-full cursor-default overflow-hidden relative">
                        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                        <feature.icon className="size-8 text-zinc-400 mb-6 transition-colors duration-500 group-hover:text-emerald-500 relative z-10" />
                        <h4 className="text-xl text-zinc-100 font-medium mb-3 relative z-10">{feature.title}</h4>
                        <p className="text-base text-zinc-500 font-light leading-relaxed relative z-10">{feature.desc}</p>
                      </GlassCard>
                    </Tilt>
                  </div>
                ))}
              </div>
            </InView>
          </div>
        </section>

        {/* CTA */}
        <section className="py-48 md:py-64 relative z-20 bg-zinc-950 border-t border-zinc-900/50">
          <div className="container mx-auto max-w-4xl px-6 md:px-16 text-center">
            <InView variants={{
              hidden: { opacity: 0, y: 24, filter: "blur(4px)" },
              visible: { opacity: 1, y: 0, filter: "blur(0px)" }
            }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}>
              <h2 className="text-5xl md:text-6xl font-medium tracking-tight mb-8">
                RestaurantOS
              </h2>
              <p className="text-2xl text-zinc-400 font-light mb-16 animate-pulse-slow">
                Modern restaurant operations. One platform.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <Link href="/login" className="w-full sm:w-auto">
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
