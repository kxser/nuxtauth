
import { sanitizeString } from "~/server/utils/sanitizeString";
import {logout} from "~/server/utils/auth/logout";
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

    await logout(sessionId);

    return

    
   
  });
  