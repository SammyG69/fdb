import { z } from "zod";
import { baseEventSchema } from "./baseEvent.Schema.js";

const payloadSchema = z.object({
  mealId: z.string().uuid(),
  userId: z.string().min(1),
  mealType: z.enum(["breakfast", "lunch", "dinner", "snack"]),
  mealDate: z.string().date(),
  totalCalories: z.number().nonnegative().default(0),
  totalProtein: z.number().nonnegative().default(0),
  totalCarbs: z.number().nonnegative().default(0),
  totalFats: z.number().nonnegative().default(0),
});

export const mealUpdatedEventSchema = baseEventSchema.extend({
  eventType: z.literal("MealUpdated"),
  payload: payloadSchema
});