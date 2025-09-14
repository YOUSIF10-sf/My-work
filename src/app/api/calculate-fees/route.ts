
import { NextResponse } from 'next/server';
import { calculateValetFees, CalculateValetFeesInput } from '@/ai/flows/calculate-valet-fees';

export async function POST(request: Request) {
  try {
    const body: CalculateValetFeesInput = await request.json();
    const result = await calculateValetFees(body);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in calculate-fees API route:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
