declare global {
    interface AuthUser {
        username: string;
        email: string;
        passwordHash: string; 
        role: 'admin' | 'user';
        userPrivilegeId: number; //Useful for scenarios with multiple subscription options
        createdAt: Date;
        recoveryPhraseHash?: string;
        lastLogin?: Date;
        fingerprintOnCreation: any;
        profileInfo: {
            [key: string]: any;
          };
      };
      interface AuthSession {
        sessionId: string;
        username: string;
        creationDate: Date;
        expiryDate: Date;
        fingerprint: any;
      }
}

export {};