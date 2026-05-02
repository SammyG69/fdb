import { NextRequest, NextResponse } from 'next/server';

const TRACKING_SERVICE_URL = process.env.TRACKING_SERVICE_URL || 'http://localhost:4003';

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const response = await fetch(`${TRACKING_SERVICE_URL}/tracked-meals/${id}`, {
    method: 'DELETE',
  });
  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const response = await fetch(`${TRACKING_SERVICE_URL}/tracked-meals/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}
