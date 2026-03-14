import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

export async function handleMealUpdated(event) {
  const {
    meal_id,
    user_id,
    calories,
    protein,
    carbs,
    fat,
    logged_at
  } = event;

  try {

    await pool.query(
      `
      UPDATE meal_logs
      SET
        calories = $1,
        protein = $2,
        carbs = $3,
        fat = $4,
        logged_at = $5
      WHERE meal_id = $6 AND user_id = $7
      `,
      [
        calories,
        protein,
        carbs,
        fat,
        logged_at,
        meal_id,
        user_id
      ]
    );

    console.log(`Meal updated: ${meal_id}`);

  } catch (error) {
    console.error("Error updating meal:", error);
  }
}