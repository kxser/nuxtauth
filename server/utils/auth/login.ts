/*
RETURN CODES:
    -1 : User with username/pass combination not found.


IMPLEMENTATION:
Client side login --> server/api/auth/login --> server/utils/auth/login 
*/

import { sanitizeString } from "../sanitizeString";
import { createSession } from "./session";


export async function login(username: string, password: string) {

    const user = await authenticateUser(sanitizeString(username, {maxLength: 16}), sanitizeString(password, {maxLength: 256}));
    if (!user) {
        return {
            success: false,
            statusCode: -1,
            response: null
        }
    }
    const session = await createSession(user.username);
    return {
        success: true,
        statusCode: 0,
        response: {session:session}
    };
}