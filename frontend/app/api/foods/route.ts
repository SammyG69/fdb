import pool from '@/lib/mealdb'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query || query.trim().length === 0) {
    return Response.json([]);
  }

 const result = await pool.query(
  `SELECT id, name, calories, protein, carbs, fats, fiber,
          ts_rank(to_tsvector('english', name), websearch_to_tsquery('english', $1)) AS rank
   FROM foods
   WHERE to_tsvector('english', name) @@ websearch_to_tsquery('english', $1)
   ORDER BY rank DESC
   LIMIT 20`,
  [query.trim()]
);
  return Response.json(result.rows);
}
