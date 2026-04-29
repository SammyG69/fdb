import { NextRequest, NextResponse } from 'next/server';

const TRACKING_SERVICE_URL = process.env.TRACKING_SERVICE_URL || 'http://localhost:4003';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'userId is required' }, { status: 400 });
  }

  const today = new Date().toISOString().split('T')[0];
  const response = await fetch(
    `${TRACKING_SERVICE_URL}/tracked-meals?userId=${encodeURIComponent(userId)}&date=${today}`
  );

  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}
