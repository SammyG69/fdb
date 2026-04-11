import pool from '@/lib/mealdb'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  const result = await pool.query(
    `SELECT calories, protein, carbs, fats, fiber FROM foods
 WHERE to_tsvector('english', name) @@ websearch_to_tsquery('english', $1)
 LIMIT 20`,
    [query]
  );
  return Response.json(result.rows);
}
