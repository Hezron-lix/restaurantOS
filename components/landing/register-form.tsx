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
import { Eye, EyeOff, Loader2 } from "lucide-react";

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
