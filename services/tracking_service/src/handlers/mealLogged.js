import { pool } from "../db.js";

export default async function handleMealLogged(payload) {
  console.log("Handling MealLogged event");

  const { mealId, userId, mealType, mealDate } = payload;

  await pool.query(
    `
    INSERT INTO tracked_meals (meal_id, user_id, meal_type, meal_date)
    VALUES ($1, $2, $3, $4)
    ON CONFLICT (meal_id) DO NOTHING
    `,
    [mealId, userId, mealType, mealDate]
  );

  console.log(`Meal tracked: ${mealId} (${mealType} on ${mealDate}) for user ${userId}`);
}
