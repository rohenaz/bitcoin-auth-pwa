import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { env } from '@/lib/env';

export async function GET(req: NextRequest) {
  try {
    // Get the raw token to debug
    const token = await getToken({ 
      req, 
      secret: env.AUTH_SECRET,
      raw: true // Get raw JWT string
    });
    
    // Get the decoded token
    const decodedToken = await getToken({ 
      req, 
      secret: env.AUTH_SECRET 
    });
    
    // Get cookies for debugging
    const cookies = req.cookies.getAll();
    const sessionCookie = cookies.find(c => c.name === 'authjs.session-token' || c.name === '__Secure-authjs.session-token');
    
    return NextResponse.json({
      hasToken: !!token,
      hasDecodedToken: !!decodedToken,
      tokenLength: token?.length,
      decodedToken: decodedToken ? {
        sub: decodedToken.sub,
        address: decodedToken.address,
        provider: decodedToken.provider,
        exp: decodedToken.exp,
        iat: decodedToken.iat,
      } : null,
      cookies: cookies.map(c => ({ name: c.name, length: c.value.length })),
      sessionCookieName: sessionCookie?.name,
      sessionCookieLength: sessionCookie?.value.length,
      authUrl: process.env.AUTH_URL || env.NEXTAUTH_URL || process.env.NEXTAUTH_URL,
      nodeEnv: process.env.NODE_ENV,
    });
  } catch (error) {
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}