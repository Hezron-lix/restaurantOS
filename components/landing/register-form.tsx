"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TextEffect } from "@/components/ui/text-effect";
import { registerSchema, type RegisterInput } from "@/validations/auth";
import { registerWithEmail } from "@/app/actions/auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Loader2, Mail } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

// Translates Supabase error messages into human-friendly copy
function getFriendlyAuthError(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes("rate limit") || lower.includes("email rate limit") || lower.includes("too many requests")) {
    return "Too many sign-up attempts. Supabase has temporarily rate-limited this action. Please wait a few minutes before trying again.";
  }
  if (lower.includes("already registered") || lower.includes("user already exists") || lower.includes("email already in use")) {
    return "An account with this email already exists. Try signing in instead.";
  }
  if (lower.includes("weak password") || lower.includes("password should be")) {
    return "Your password is too weak. Please choose a stronger password (at least 6 characters).";
  }
  if (lower.includes("invalid email")) {
    return "Please enter a valid email address.";
  }
  return message;
}

export function RegisterForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [requiresVerification, setRequiresVerification] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterInput) => {
    // react-hook-form sets isSubmitting=true for the duration of this async fn,
    // which disables the button immediately — no duplicate requests possible.
    try {
      const response = await registerWithEmail(data);

      if (!response.success) {
        toast.error("Registration failed", {
          description: getFriendlyAuthError(response.error.message),
          duration: 8000,
        });
        return;
      }

      if (response.data?.requiresEmailVerification) {
        setRequiresVerification(true);
        return;
      }

      toast.success("Account created", {
        description: "Redirecting to onboarding…",
      });

      // Dashboard layout detects no restaurant_id and redirects to /onboarding
      router.push("/dashboard");
      router.refresh();

    } catch {
      toast.error("Unexpected error", {
        description: "Something went wrong. Please try again.",
      });
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/api/auth/callback`,
        },
      });
      if (error) throw error;
    } catch {
      setIsGoogleLoading(false);
      toast.error("Google Registration failed", {
        description: "Could not initialize Google authentication.",
      });
    }
  };

  if (requiresVerification) {
    return (
      <GlassCard className="w-full max-w-md p-8 relative overflow-hidden text-center">
        {/* Ambient glow */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand to-transparent opacity-50" />
        <div className="absolute -top-24 -inset-x-24 h-48 bg-brand/10 blur-[100px] pointer-events-none" />
        
        <div className="relative z-10 space-y-6">
          <div className="mx-auto w-12 h-12 rounded-full bg-brand/10 flex items-center justify-center">
            <Mail className="w-6 h-6 text-brand" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-zinc-100 mb-2">Check your email</h2>
            <p className="text-zinc-400 text-sm">
              We&apos;ve sent a verification link to your email address. After verifying, you can sign in to RestaurantOS.
            </p>
          </div>
          <Button 
            className="w-full" 
            variant="outline" 
            onClick={() => router.push("/login")}
          >
            Back to Login
          </Button>
        </div>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="w-full max-w-md p-8 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand to-transparent opacity-50" />
      <div className="absolute -top-24 -inset-x-24 h-48 bg-brand/10 blur-[100px] pointer-events-none" />

      <div className="relative z-10">
        <h1 className="text-3xl font-semibold tracking-tight mb-2 text-zinc-100">
          <TextEffect preset="blur" per="char">
            Create an account
          </TextEffect>
        </h1>
        <p className="text-sm text-zinc-400 mb-8 font-light">
          Get started with RestaurantOS today.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
          {/* Full Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">Full Name</label>
            <Input
              {...register("fullName")}
              id="register-name"
              type="text"
              autoComplete="name"
              placeholder="John Doe"
              className="bg-zinc-900/50 border-white/10 h-12 rounded-xl focus-visible:ring-brand focus-visible:border-brand/50"
              disabled={isSubmitting}
            />
            {errors.fullName && (
              <p className="text-sm text-destructive mt-1">{errors.fullName.message}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">Email Address</label>
            <Input
              {...register("email")}
              id="register-email"
              type="email"
              autoComplete="email"
              placeholder="manager@restaurant.com"
              className="bg-zinc-900/50 border-white/10 h-12 rounded-xl focus-visible:ring-brand focus-visible:border-brand/50"
              disabled={isSubmitting}
            />
            {errors.email && (
              <p className="text-sm text-destructive mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">Password</label>
            <div className="relative">
              <Input
                {...register("password")}
                id="register-password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="••••••••"
                className="bg-zinc-900/50 border-white/10 h-12 rounded-xl pr-12 focus-visible:ring-brand focus-visible:border-brand/50"
                disabled={isSubmitting}
              />
              <button
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200 transition-colors p-1"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-destructive mt-1">{errors.password.message}</p>
            )}
          </div>

          <Button
            id="register-submit"
            type="submit"
            disabled={isSubmitting}
            className="w-full h-12 rounded-xl bg-brand text-brand-foreground hover:bg-brand/90 transition-all shadow-[0_0_30px_-5px_rgba(234,179,8,0.3)] active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Creating account…
              </span>
            ) : (
              "Sign Up"
            )}
          </Button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-white/10" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-zinc-950 px-2 text-zinc-500">Or continue with</span>
          </div>
        </div>

        <Button
          type="button"
          onClick={handleGoogleLogin}
          disabled={isSubmitting || isGoogleLoading}
          variant="outline"
          className="w-full h-12 rounded-xl bg-zinc-900/50 border-white/10 hover:bg-zinc-900 transition-colors text-zinc-300 disabled:opacity-70 disabled:pointer-events-none"
        >
          {isGoogleLoading ? (
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
          ) : (
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
          )}
          Google
        </Button>

        <div className="mt-6 text-center text-sm text-zinc-400">
          Already have an account?{" "}
          <Link href="/login" className="text-brand hover:text-brand/80 transition-colors">
            Sign In
          </Link>
        </div>
      </div>
    </GlassCard>
  );
}
