import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const state = searchParams.get('state');

  // Base URL for redirect
  const baseUrl = process.env.NEXTAUTH_URL || process.env.VERCEL_URL || request.url.split('/api')[0];
  
  // Redirect back to components demo page with Yours Wallet connector selected
  let redirectUrl = baseUrl + '/components';
  
  if (error) {
    // Handle OAuth error
    redirectUrl += `?oauth_error=${encodeURIComponent(error)}&provider=yours-wallet`;
  } else if (code) {
    // Handle successful OAuth (in a real app, you'd process the code here)
    redirectUrl += `?oauth_success=true&provider=yours-wallet&code=${encodeURIComponent(code)}`;
    if (state) {
      redirectUrl += `&state=${encodeURIComponent(state)}`;
    }
  } else {
    // No code or error - redirect to error state
    redirectUrl += `?oauth_error=no_code&provider=yours-wallet`;
  }

  return NextResponse.redirect(redirectUrl);
} 