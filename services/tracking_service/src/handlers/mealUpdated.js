import { pool } from "../db.js";

export default async function handleMealUpdated(payload) {
  console.log("Handling MealUpdated event");

  const { mealId, userId, mealType, mealDate } = payload;

  await pool.query(
    `
    UPDATE tracked_meals
    SET meal_type = $1, meal_date = $2
    WHERE meal_id = $3 AND user_id = $4
    `,
    [mealType, mealDate, mealId, userId]
  );

  console.log(`Meal updated: ${mealId}`);
}
