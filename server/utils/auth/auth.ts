import bcrypt from 'bcrypt';
import { userStorageService } from '~/server/plugins/database';

const SALT_ROUNDS = 10;

export async function createUser(userData: {
  username: string;
  email: string;
  password: string;
  recoveryPhrase: string; 
  role?: 'admin' | 'user';
  userPrivilegeId?: number;
  createdAt?: Date;
  lastLogin?: Date;
  fingerprintOnCreation?: any;
  profileInfo?: {
    [key: string]: any;
  };
}) {
  const { 
    username, 
    email, 
    password, 
    recoveryPhrase,
    role = 'user',
    userPrivilegeId = 1,
    createdAt = new Date(),
    lastLogin,
    fingerprintOnCreation = {},
    profileInfo = {}
  } = userData;

  // Check if username/email already exists
  const users = await userStorageService.getKeys('user:');
  for (const userKey of users) {
    const user = await userStorageService.get(userKey) as AuthUser | null;
    if (user && user.username === username) {
      return {
        success: false,
        response: {"Username": 'Username already exists.'}
      }
    }
    if (user && user.email === email) {
      return {
        success: false,
        response: {"Email": 'Email already exists.'}
      }
    }
  }

  // Hash password
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const recoveryPhraseHash = await bcrypt.hash(recoveryPhrase, SALT_ROUNDS);
  // Create user object - ADD recoveryPhrase here
  const newUser: AuthUser = {
    username,
    email,
    passwordHash,
    role,
    userPrivilegeId,
    createdAt,
    recoveryPhraseHash,
    fingerprintOnCreation,
    profileInfo
  };
  
  // Save to database
  await userStorageService.set(`user:${newUser.username}`, newUser);
  
  // Return user (without password)
  const { passwordHash: _, ...userWithoutPassword } = newUser;
  return {
    success: true,
    response: userWithoutPassword as AuthUser
  };
}

export async function getUserbyUsername(username: string, includePassword = false) {
    // Get all user keys
    
    const userKey = await userStorageService.get(`user:${username}`);
    return userKey
};



export async function authenticateUser(username: string, password: string) {
  const user = await getUserbyUsername(username, true) as AuthUser | null;
  
  if (!user || !user.passwordHash) {
    return null;
  }
  
  const passwordValid = await bcrypt.compare(password, user.passwordHash);
  
  if (!passwordValid) {
    return null;
  }
  
  const { passwordHash: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
}


