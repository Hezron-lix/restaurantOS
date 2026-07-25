"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Store, MapPin, Settings, CheckCircle2, ArrowRight, ArrowLeft } from "lucide-react";

import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TextEffect } from "@/components/ui/text-effect";
import { restaurantOnboardingSchema, type RestaurantOnboardingInput } from "@/validations/onboarding";
import { createRestaurantAction } from "@/app/actions/onboarding";

const STEPS = [
  { id: "info", title: "Restaurant Info", icon: Store },
  { id: "location", title: "Location", icon: MapPin },
  { id: "operations", title: "Operations", icon: Settings },
  { id: "review", title: "Review", icon: CheckCircle2 },
];

export function OnboardingFlow() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    trigger,
    getValues,
    formState: { errors },
  } = useForm<RestaurantOnboardingInput>({
    resolver: zodResolver(restaurantOnboardingSchema),
    mode: "onTouched",
    defaultValues: {
      tables: 10,
      reservations_enabled: true,
      timezone: "UTC",
      currency: "USD",
    }
  });

  const nextStep = async () => {
    // Validate current step fields before proceeding
    let fieldsToValidate: (keyof RestaurantOnboardingInput)[] = [];
    if (currentStep === 0) fieldsToValidate = ['name', 'phone', 'email'];
    if (currentStep === 1) fieldsToValidate = ['address', 'city', 'country', 'timezone', 'currency'];
    if (currentStep === 2) fieldsToValidate = ['tables', 'reservations_enabled'];

    const isStepValid = await trigger(fieldsToValidate);
    if (isStepValid) {
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1));
    }
  };

  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  const onSubmit = async (data: RestaurantOnboardingInput) => {
    setIsSubmitting(true);
    
    try {
      const response = await createRestaurantAction(data);
      
      if (!response.success) {
        toast.error("Submission failed", {
          description: response.error.message,
        });
        return;
      }

      toast.success("Restaurant Created!", {
        description: "Redirecting to your dashboard...",
      });
      
      // Wait slightly for toast, then redirect
      setTimeout(() => {
        router.push("/dashboard");
        router.refresh();
      }, 1000);
      
    } catch {
      toast.error("Error", {
        description: "An unexpected error occurred.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Progress Indicator */}
      <div className="mb-8 flex justify-between relative">
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/5 -translate-y-1/2 z-0" />
        <div 
          className="absolute top-1/2 left-0 h-0.5 bg-brand -translate-y-1/2 z-0 transition-all duration-500 ease-in-out" 
          style={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%` }}
        />
        
        {STEPS.map((step, index) => {
          const Icon = step.icon;
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;
          
          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center gap-2">
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isActive 
                    ? "bg-brand text-brand-foreground shadow-[0_0_15px_-3px_rgba(234,179,8,0.5)] scale-110" 
                    : isCompleted 
                      ? "bg-brand/20 text-brand border border-brand/30"
                      : "bg-zinc-900 border border-white/10 text-zinc-500"
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className={`text-xs font-medium ${isActive ? "text-brand" : "text-zinc-500"}`}>
                {step.title}
              </span>
            </div>
          );
        })}
      </div>

      <GlassCard className="p-8 relative overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand to-transparent opacity-50" />
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <AnimatePresence mode="wait">
            {currentStep === 0 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-semibold text-zinc-100 mb-1">Restaurant Details</h2>
                  <p className="text-zinc-400 text-sm">Let&apos;s start with the basics.</p>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-300">Restaurant Name</label>
                    <Input {...register("name")} placeholder="The Grand Continental" className="bg-zinc-900/50" />
                    {errors.name && <p className="text-xs text-destructive">{errors.name.message as string}</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-zinc-300">Phone</label>
                      <Input {...register("phone")} placeholder="+1 (555) 000-0000" className="bg-zinc-900/50" />
                      {errors.phone && <p className="text-xs text-destructive">{errors.phone.message as string}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-zinc-300">Public Email</label>
                      <Input {...register("email")} type="email" placeholder="contact@restaurant.com" className="bg-zinc-900/50" />
                      {errors.email && <p className="text-xs text-destructive">{errors.email.message as string}</p>}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 1 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-semibold text-zinc-100 mb-1">Location & Regional</h2>
                  <p className="text-zinc-400 text-sm">Where are you located?</p>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-300">Address</label>
                    <Input {...register("address")} placeholder="123 Main St" className="bg-zinc-900/50" />
                    {errors.address && <p className="text-xs text-destructive">{errors.address.message as string}</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-zinc-300">City</label>
                      <Input {...register("city")} placeholder="New York" className="bg-zinc-900/50" />
                      {errors.city && <p className="text-xs text-destructive">{errors.city.message as string}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-zinc-300">Country</label>
                      <Input {...register("country")} placeholder="United States" className="bg-zinc-900/50" />
                      {errors.country && <p className="text-xs text-destructive">{errors.country.message as string}</p>}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-zinc-300">Timezone</label>
                      <Input {...register("timezone")} placeholder="UTC" className="bg-zinc-900/50" />
                      {errors.timezone && <p className="text-xs text-destructive">{errors.timezone.message as string}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-zinc-300">Currency Code</label>
                      <Input {...register("currency")} placeholder="USD" className="bg-zinc-900/50" maxLength={3} />
                      {errors.currency && <p className="text-xs text-destructive">{errors.currency.message as string}</p>}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-semibold text-zinc-100 mb-1">Operations</h2>
                  <p className="text-zinc-400 text-sm">Configure your basic operational limits.</p>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-300">Number of Tables</label>
                    <Input 
                      {...register("tables", { valueAsNumber: true })} 
                      type="number" 
                      placeholder="10" 
                      className="bg-zinc-900/50" 
                    />
                    {errors.tables && <p className="text-xs text-destructive">{errors.tables.message as string}</p>}
                    <p className="text-xs text-zinc-500">This will pre-generate your table map.</p>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 rounded-xl border border-white/10 bg-zinc-900/30">
                    <div>
                      <p className="font-medium text-zinc-200 text-sm">Enable Reservations</p>
                      <p className="text-xs text-zinc-400">Allow guests to book tables online.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" {...register("reservations_enabled")} className="sr-only peer" />
                      <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand"></div>
                    </label>
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="text-center">
                  <div className="mx-auto w-16 h-16 rounded-full bg-brand/20 flex items-center justify-center mb-4">
                    <Store className="w-8 h-8 text-brand" />
                  </div>
                  <h2 className="text-2xl font-semibold text-zinc-100 mb-1">
                    <TextEffect preset="blur" per="char">
                      Ready to Launch
                    </TextEffect>
                  </h2>
                  <p className="text-zinc-400 text-sm">Review your details before creating the restaurant.</p>
                </div>
                
                <div className="bg-zinc-900/50 border border-white/5 rounded-xl p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-zinc-500 block mb-1">Name</span>
                      <span className="text-zinc-200 font-medium">{getValues("name")}</span>
                    </div>
                    <div>
                      <span className="text-zinc-500 block mb-1">Location</span>
                      <span className="text-zinc-200 font-medium">{getValues("city")}, {getValues("country")}</span>
                    </div>
                    <div>
                      <span className="text-zinc-500 block mb-1">Tables</span>
                      <span className="text-zinc-200 font-medium">{getValues("tables")}</span>
                    </div>
                    <div>
                      <span className="text-zinc-500 block mb-1">Currency</span>
                      <span className="text-zinc-200 font-medium">{getValues("currency")}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/5">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 0 || isSubmitting}
              className="w-32 bg-transparent border-white/10 hover:bg-white/5"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>

            {currentStep < STEPS.length - 1 ? (
              <Button
                type="button"
                onClick={nextStep}
                className="w-32 bg-brand text-brand-foreground hover:bg-brand/90"
              >
                Next <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-40 bg-brand text-brand-foreground hover:bg-brand/90 shadow-[0_0_20px_-5px_rgba(234,179,8,0.3)]"
              >
                {isSubmitting ? "Creating..." : "Create Restaurant"}
              </Button>
            )}
          </div>
        </form>
      </GlassCard>
    </div>
  );
}
