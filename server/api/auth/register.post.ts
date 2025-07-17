import { sanitizeString } from "~/server/utils/sanitizeString";
import { createUser } from "~/server/utils/auth/auth";
import { H3Event } from "h3";

export default defineEventHandler(async (event: H3Event) => {
  const runtimeConfig = useRuntimeConfig(event);
  const body = await readBody(event);
  
  if (!body) {
    return {
      success: false,
      statusCode: 400,
      response: "Missing request body",
    };
  }

  const { username, email, password, recoveryPhrase } = body;

  try {
    // Trim all inputs
    const trimmedUsername = username?.trim() || "";
    const trimmedEmail = email?.trim() || "";
    const trimmedPassword = password?.trim() || "";

    // Server-side validation
    const errors: Record<string, string> = {};

    // Validate username
    if (!trimmedUsername) {
      errors.username = "Username must not be empty.";
    } else if (trimmedUsername.length < 3 || trimmedUsername.length > 24) {
      errors.username = "Username: 3-24 characters required";
    }

    // Validate email
    if (!trimmedEmail) {
      errors.email = "Email must not be empty.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      errors.email = "Please enter a valid email address.";
    }

    // Validate password
    if (!trimmedPassword) {
      errors.password = "Password must not be empty.";
    } else if (trimmedPassword.length < 8 || trimmedPassword.length > 256) {
      errors.password = "Password: 8-256 characters required.";
    } else if (!/(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])(?=.*[a-z])(?=.*[A-Z])/.test(trimmedPassword)) {
      errors.password = "Password: Need uppercase, lowercase, number, and special character.";
    }

    // If validation errors exist, return them
    if (Object.keys(errors).length > 0) {
      return {
        success: false,
        statusCode: 400,
        response: errors
      };
    }

    // Sanitize inputs
    const sanitizedUsername = sanitizeString(trimmedUsername, { maxLength: 24 });
    const sanitizedEmail = sanitizeString(trimmedEmail, { maxLength: 64 });
    const sanitizedPassword = sanitizeString(trimmedPassword, { maxLength: 256 });
    const sanitizedRecoveryPhrase = sanitizeString(recoveryPhrase, { maxLength: 256 });
    
    // Get fingerprint info from request if available
    const fingerprint = {};
    
    // Create user object matching AuthUser interface
    const newUser: Omit<AuthUser, 'passwordHash'> & { password: string } = {
      username: sanitizedUsername,
      email: sanitizedEmail,
      recoveryPhrase: sanitizedRecoveryPhrase, // Optional, can be set later
      password: sanitizedPassword, // Will be hashed in createUser
      role: 'user', // Default role
      userPrivilegeId: 0, 
      createdAt: new Date(),
      fingerprintOnCreation: fingerprint,
      profileInfo: {}
    };
 
    // Create the user (createUser will handle password hashing)
    const createUserResponse = await createUser(newUser);
    
    if (!createUserResponse.success) {
      return {
        success: false,
        statusCode: 400,
        response: createUserResponse.response
      };
    }
    
    const user = createUserResponse.response;
    
    // Type guard to ensure user is AuthUser object, not string
    if (typeof user === 'string') {
      return {
        success: false,
        statusCode: 400,
        response: createUserResponse.response
      };
    }
    
    return {
      success: true,
      statusCode: 0,
      response: { user: { username: user.username, email: user.email } } 
    };
  } catch (error) {
    console.error("Registration error:", error);
    return {
      success: false,
      statusCode: -2,
      response: "Registration failed."
    };
  }
});

// Helper function to get fingerprint data
