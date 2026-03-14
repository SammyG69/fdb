import { z } from "zod";
import { baseEventSchema } from "./baseEvent.schema.js";

const payloadSchema = z.object({
  mealId: z.string().min(1),
  userId: z.string().min(1),
  name: z.string().min(1),
  calories: z.number().nonnegative(),
  protein: z.number().nonnegative(),
  carbs: z.number().nonnegative(),
  fat: z.number().nonnegative(),
  loggedAt: z.string().datetime()
});

export const mealLoggedEventSchema = baseEventSchema.extend({
  eventType: z.literal("MealLogged"),
  payload: payloadSchema
});