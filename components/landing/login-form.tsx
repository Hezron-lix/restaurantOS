"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TextEffect } from "@/components/ui/text-effect";
import { loginSchema, type LoginInput } from "@/validations/auth";

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true);
    setError(null);
    try {
      // TODO: Connect to Supabase Auth
      console.log("Login data:", data);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // throw new Error("Not implemented yet");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred during login.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <GlassCard className="w-full max-w-md p-8 relative overflow-hidden">
      {/* Background ambient glow specific to the card */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand to-transparent opacity-50" />
      <div className="absolute -top-24 -inset-x-24 h-48 bg-brand/10 blur-[100px] pointer-events-none" />

      <div className="relative z-10">
        <h1 className="text-3xl font-semibold tracking-tight mb-2 text-zinc-100">
          <TextEffect preset="blur" per="char">
            Welcome back
          </TextEffect>
        </h1>
        <p className="text-sm text-zinc-400 mb-8 font-light">
          Sign in to access the RestaurantOS dashboard.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">Email Address</label>
            <Input
              {...register("email")}
              type="email"
              placeholder="manager@restaurant.com"
              className="bg-zinc-900/50 border-white/10 h-12 rounded-xl focus-visible:ring-brand focus-visible:border-brand/50"
              disabled={isLoading}
            />
            {errors.email && (
              <p className="text-sm text-destructive mt-1">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">Password</label>
            <Input
              {...register("password")}
              type="password"
              placeholder="••••••••"
              className="bg-zinc-900/50 border-white/10 h-12 rounded-xl focus-visible:ring-brand focus-visible:border-brand/50"
              disabled={isLoading}
            />
            {errors.password && (
              <p className="text-sm text-destructive mt-1">{errors.password.message}</p>
            )}
          </div>

          {error && <p className="text-sm text-destructive font-medium">{error}</p>}

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 rounded-xl bg-brand text-brand-foreground hover:bg-brand/90 transition-all shadow-[0_0_30px_-5px_rgba(234,179,8,0.3)] active:scale-[0.98]"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </div>
    </GlassCard>
  );
}
