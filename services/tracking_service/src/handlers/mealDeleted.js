import { pool } from "../db.js";

export default async function handleMealDeleted(payload) {
  console.log("Handling MealDeleted event");

  const { mealId } = payload;

  await pool.query(
    `DELETE FROM tracked_meals WHERE meal_id = $1`,
    [mealId]
  );

  console.log(`Meal deleted: ${mealId}`);
}
