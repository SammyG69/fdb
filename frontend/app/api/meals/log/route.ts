import { NextRequest, NextResponse } from 'next/server';

const MEAL_SERVICE_URL = process.env.MEAL_SERVICE_URL || 'http://localhost:4002';

export async function POST(request: NextRequest) {
  const body = await request.json();

  const response = await fetch(`${MEAL_SERVICE_URL}/meals/log`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}
