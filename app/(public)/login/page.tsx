import { LoginForm } from "@/components/landing/login-form";

export const metadata = {
  title: "Login | RestaurantOS",
  description: "Sign in to RestaurantOS.",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden bg-zinc-950">
      {/* Cinematic ambient background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[20%] left-[20%] w-[40vw] h-[40vw] bg-brand/10 rounded-full blur-[150px] mix-blend-screen animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-[20%] right-[20%] w-[50vw] h-[50vw] bg-zinc-800/40 rounded-full blur-[150px] mix-blend-screen" />
      </div>

      <div className="relative z-10 w-full flex justify-center px-4">
        <LoginForm />
      </div>
    </div>
  );
}
