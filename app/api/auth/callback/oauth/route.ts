import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth-helpers';

export async function GET(request: Request) {
  const session = await auth();
  const { searchParams } = new URL(request.url);
  const returnUrl = searchParams.get('returnUrl') || '/signup/oauth';

  // If user is authenticated via OAuth, redirect to complete signup
  if (session?.user) {
    return NextResponse.redirect(new URL(returnUrl, request.url));
  }

  // Otherwise redirect to signin
  return NextResponse.redirect(new URL('/signin', request.url));
}