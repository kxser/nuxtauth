import { invalidateSession } from "./session";
/*
IMPLEMENTATION:
Client side logout --> server/api/auth/logout --> server/utils/auth/logout 
*/

export async function logout(sessionId: string) {
    await invalidateSession(sessionId);
    return {
        success: true,
        statusCode: 0,
        response: null
    };  
}