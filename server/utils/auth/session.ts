import { randomUUID } from 'crypto';
import { sessionStorageService } from '~/server/plugins/database';


const DEFAULT_SESSION_EXPIRY = 24 * 60 * 60 * 1000;


export async function createSession(
  username: string,
  fingerprint: any = {},
  expiryMs: number = DEFAULT_SESSION_EXPIRY
): Promise<AuthSession> {
  const sessionId = randomUUID();
  const creationDate = new Date();
  const expiryDate = new Date(creationDate.getTime() + expiryMs);
  const session: AuthSession = {
    sessionId,
    username,
    creationDate,
    expiryDate,
    fingerprint
  };
  
  // Store the session
  
  await sessionStorageService.set(`session:${sessionId}`, session);
  
  return session;
}


export async function validateSession(sessionId: string): Promise<AuthSession | null> {
  const session = await sessionStorageService.get(`session:${sessionId}`) as AuthSession | null;

  // Session doesn't exist
  if (!session) {
    return null;
  }
  
  // Check if session has expired
  const now = new Date();
  if (now > new Date(session.expiryDate)) {
    // Session has expired, remove it
    await invalidateSession(sessionId);
    return null;
  }
  
  // TODO: Add fingerprint validation to prevent session hijacking
  
  return session;
}


export async function invalidateSession(sessionId: string): Promise<boolean> {
  const session = await sessionStorageService.get(`session:${sessionId}`);
  
  if (session) {
    await sessionStorageService.remove(`session:${sessionId}`);
    return true;
  }
  
  return false;
}