import pool from '@/lib/mealdb'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query || query.trim().length === 0) {
    return Response.json([]);
  }

  const result = await pool.query(
    `SELECT name, calories, protein, carbs, fats, fiber
     FROM foods
     WHERE name ILIKE '%' || $1 || '%'
     ORDER BY name
     LIMIT 20`,
    [query.trim()]
  );
  return Response.json(result.rows);
}
