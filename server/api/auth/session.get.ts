import { sanitizeString } from "~/server/utils/sanitizeString";
import { validateSession } from "~/server/utils/auth/session";

export default defineEventHandler(async (event) => {
    const runtimeConfig = useRuntimeConfig(event);
    const query = getQuery(event);
    
    if (!query.sessionId) {
      return {
        success: false,
        statusCode: 400,
        response: "",
      };
    }
  
    const sessionId = query.sessionId as string;
    const sessionStatus = await validateSession(sessionId);

    return sessionStatus;
});