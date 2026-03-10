import { z } from 'zod';

export const mealSchema = z.object({
  id: z.string().uuid(),
  calories: z.number().min(0),
  protein: z.number().min(0),
  fat: z.number().min(0),
  carbs: z.number().min(0),
  fibre: z.number().min(0),
});

export type Meal = z.infer<typeof mealSchema>;