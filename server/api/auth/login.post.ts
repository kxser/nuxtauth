
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
  
    const {username, password} = body;

    const loginStatus = await login(username, password);

    return loginStatus

    
   
  });
  