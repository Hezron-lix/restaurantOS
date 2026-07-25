import { OnboardingFlow } from "@/components/onboarding/OnboardingFlow";

export default function OnboardingPage() {

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden bg-zinc-950 p-4">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[30%] left-[30%] w-[30vw] h-[30vw] bg-brand/10 rounded-full blur-[120px] mix-blend-screen animate-pulse" style={{ animationDuration: '6s' }} />
      </div>

      <div className="relative z-10 w-full py-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3 text-zinc-100">
            Welcome to RestaurantOS
          </h1>
          <p className="text-zinc-400 max-w-md mx-auto text-sm">
            Let&apos;s get your restaurant set up and ready for service.
          </p>
        </div>
        
        <OnboardingFlow />
      </div>
    </div>
  );
}
