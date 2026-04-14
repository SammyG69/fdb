import { NextRequest, NextResponse } from 'next/server';

const TRACKING_SERVICE_URL = process.env.TRACKING_SERVICE_URL || 'http://localhost:4003';

export async function POST(request: NextRequest) {
  const body = await request.json();

  const response = await fetch(`${TRACKING_SERVICE_URL}/tracked-meals`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}
