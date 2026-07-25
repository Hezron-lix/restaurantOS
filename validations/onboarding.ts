import { z } from 'zod';

export const restaurantInfoSchema = z.object({
  name: z.string().min(2, "Restaurant name is required"),
  phone: z.string().min(5, "Valid phone number is required"),
  email: z.string().email("Valid email is required"),
});

export const locationSchema = z.object({
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  country: z.string().min(2, "Country is required"),
  timezone: z.string().min(2, "Timezone is required"),
  currency: z.string().min(3, "Currency code is required").max(3),
});

export const operationsSchema = z.object({
  tables: z.number().int().min(1, "Must have at least 1 table").max(500, "Maximum 500 tables supported"),
  reservations_enabled: z.boolean(),
});

// The final combined schema for submission
export const restaurantOnboardingSchema = restaurantInfoSchema
  .merge(locationSchema)
  .merge(operationsSchema);

export type RestaurantInfoInput = z.infer<typeof restaurantInfoSchema>;
export type LocationInput = z.infer<typeof locationSchema>;
export type OperationsInput = z.infer<typeof operationsSchema>;
export type RestaurantOnboardingInput = z.infer<typeof restaurantOnboardingSchema>;
