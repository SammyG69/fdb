import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

export async function handleMealDeleted(event) {

  const { meal_id, user_id } = event;

  try {

    await pool.query(
      `
      DELETE FROM meal_logs
      WHERE meal_id = $1 AND user_id = $2
      `,
      [meal_id, user_id]
    );

    console.log(`Meal deleted: ${meal_id}`);

  } catch (error) {
    console.error("Error deleting meal:", error);
  }
}