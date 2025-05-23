import { parseAuthToken, verifyAuthToken, type AuthPayload } from 'bitcoin-auth';
import { apiError } from './api-utils';
import { PublicKey } from '@bsv/sdk';

const TIME_PAD = 1000 * 60 * 10; // 10 minutes

interface VerifiedAuth {
  pubkey: string;
  address?: string;
}

/**
 * Verify Bitcoin authentication from request headers
 */
export async function verifyBitcoinAuth(
  request: Request,
  requestPath: string
): Promise<VerifiedAuth> {
  const authToken = request.headers.get('X-Auth-Token');
  
  if (!authToken) {
    throw new Error('No auth token provided');
  }
  
  const parsedToken = parseAuthToken(authToken);
  
  if (!parsedToken?.pubkey) {
    throw new Error('Invalid auth token format');
  }
  
  // Clone request to read body
  const body = await request.text();
  
  const payload: AuthPayload = {
    requestPath,
    body,
    timestamp: new Date().toISOString()
  };
  
  const isValid = verifyAuthToken(authToken, payload, TIME_PAD);
  
  if (!isValid) {
    throw new Error('Token verification failed');
  }
  
  return {
    pubkey: parsedToken.pubkey,
    address: PublicKey.fromString(parsedToken.pubkey).toAddress()
  };
}

/**
 * Auth middleware wrapper for API routes
 */
export function withBitcoinAuth<T extends unknown[]>(
  handler: (request: Request, auth: VerifiedAuth, ...args: T) => Promise<Response>
) {
  return async (request: Request, ...args: T) => {
    try {
      const auth = await verifyBitcoinAuth(request, request.url);
      return await handler(request, auth, ...args);
    } catch (error) {
      if (error instanceof Error) {
        return apiError(error.message, 401);
      }
      return apiError('Authentication failed', 401);
    }
  };
}