import { NextResponse } from 'next/server';

/**
 * Create a standardized error response
 */
export function apiError(message: string, status: number = 400) {
  return NextResponse.json({ error: message }, { status });
}

/**
 * Create a standardized success response
 */
export function apiSuccess<T extends Record<string, unknown>>(
  data?: T,
  message?: string
) {
  return NextResponse.json({
    success: true,
    ...data,
    ...(message && { message })
  });
}

/**
 * Handle API errors consistently
 */
export function handleApiError(error: unknown, context: string) {
  console.error(`Error in ${context}:`, error);
  
  if (error instanceof Error) {
    return apiError(error.message, 500);
  }
  
  return apiError(`Failed to ${context}`, 500);
}