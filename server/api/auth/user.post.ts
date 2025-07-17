
import { sanitizeString } from "~/server/utils/sanitizeString";
import {login} from "~/server/utils/auth/login";
export default defineEventHandler(async (event) => {
    const runtimeConfig = useRuntimeConfig(event);
    const body = await readBody(event);
    
    if (!body) {
      return {
        success: false,
        statusCode: 400,
        response: "",
      };
    }
  
    const {sessionId} = body;

    const sessionStatus = await validateSession(sessionId);

    if (sessionStatus === null) {
        return {
            success: false,
            statusCode: -1,
            response: null
        }
    }

    const { passwordHash, fingerprintOnCreation, createdAt, lastLogin, ...safeUserData } = await getUserbyUsername(sessionStatus.username);

    return safeUserData
    
    
   
  });
  