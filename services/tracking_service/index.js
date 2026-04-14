import "dotenv/config";
import express from "express";
import { pool } from "./src/db.js";
import router from "./metrics/index.js";

const app = express();
app.use(express.json());

app.get("/", (_, res) => res.json({ service: "tracking_service" }));
app.get("/health", (_, res) => res.json({ ok: true, service: "tracking_service" }));
app.use(router);

// POST /tracked-meals — log a meal with its food items
app.post("/tracked-meals", async (req, res) => {
  const {
    userId,
    mealType,
    mealDate,
    sourceType = "manual",
    sourceSavedMealId = null,
    items = [],
  } = req.body;

  if (!userId || !mealType || !mealDate) {
    return res.status(400).json({ error: "userId, mealType, and mealDate are required" });
  }

  const totalCalories = items.reduce((s, i) => s + (i.calories || 0), 0);
  const totalProtein  = items.reduce((s, i) => s + (i.protein  || 0), 0);
  const totalCarbs    = items.reduce((s, i) => s + (i.carbs    || 0), 0);
  const totalFats     = items.reduce((s, i) => s + (i.fats     || 0), 0);

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const mealResult = await client.query(
      `INSERT INTO tracked_meals
         (user_id, meal_type, meal_date, source_type, source_saved_meal_id,
          total_calories, total_protein, total_carbs, total_fats)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [userId, mealType, mealDate, sourceType, sourceSavedMealId,
       totalCalories, totalProtein, totalCarbs, totalFats]
    );

    const meal = mealResult.rows[0];

    for (const item of items) {
      await client.query(
        `INSERT INTO tracked_meal_items
           (tracked_meal_id, food_id, quantity, unit, calories, protein, carbs, fats)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [meal.id, item.foodId, item.quantity, item.unit || "g",
         item.calories || 0, item.protein || 0, item.carbs || 0, item.fats || 0]
      );
    }

    await client.query("COMMIT");
    res.status(201).json({ success: true, meal });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Failed to log meal:", err);
    res.status(500).json({ success: false, error: err.message });
  } finally {
    client.release();
  }
});

// GET /tracked-meals?userId=...&date=...
app.get("/tracked-meals", async (req, res) => {
  const { userId, date } = req.query;
  if (!userId) return res.status(400).json({ error: "userId is required" });

  const params = [userId];
  let dateClause = "";
  if (date) {
    params.push(date);
    dateClause = `AND m.meal_date = $${params.length}`;
  }

  try {
    const result = await pool.query(
      `SELECT m.*,
         COALESCE(
           json_agg(
             json_build_object(
               'id',       i.id,
               'food_id',  i.food_id,
               'quantity', i.quantity,
               'unit',     i.unit,
               'calories', i.calories,
               'protein',  i.protein,
               'carbs',    i.carbs,
               'fats',     i.fats
             )
           ) FILTER (WHERE i.id IS NOT NULL),
           '[]'
         ) AS items
       FROM tracked_meals m
       LEFT JOIN tracked_meal_items i ON i.tracked_meal_id = m.id
       WHERE m.user_id = $1 ${dateClause}
       GROUP BY m.id
       ORDER BY m.logged_at DESC`,
      params
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Failed to fetch tracked meals:", err);
    res.status(500).json({ error: err.message });
  }
});

// DELETE /tracked-meals/:id
app.delete("/tracked-meals/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM tracked_meals WHERE id = $1", [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error("Failed to delete tracked meal:", err);
    res.status(500).json({ error: err.message });
  }
});

// PATCH /tracked-meals/:id — update meal_type or meal_date
app.patch("/tracked-meals/:id", async (req, res) => {
  const { mealType, mealDate } = req.body;
  try {
    const result = await pool.query(
      `UPDATE tracked_meals
       SET meal_type = COALESCE($1, meal_type),
           meal_date = COALESCE($2, meal_date)
       WHERE id = $3
       RETURNING *`,
      [mealType, mealDate, req.params.id]
    );
    res.json({ success: true, meal: result.rows[0] });
  } catch (err) {
    console.error("Failed to update tracked meal:", err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(4003, "0.0.0.0", () => {
  console.log("tracking_service on 4003");
});
