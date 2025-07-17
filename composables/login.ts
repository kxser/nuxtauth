export async function login(username: string, password: string) {
      const { $csrfFetch } = useNuxtApp();

    const loginResponse = await $csrfFetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password })
    });
    
    if (loginResponse.statusCode === -1 || loginResponse.response === null) {
        return loginResponse;
    }

    const nuxtApp = useNuxtApp();
    const cookie = useCookie('session', {
        maxAge: 30 * 24 * 60 * 60,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/'
    });
    
    // Check if response is an object with session property
    if (typeof loginResponse.response === 'object' && loginResponse.response && 'session' in loginResponse.response) {
        cookie.value = loginResponse.response.session.sessionId;
    } else {
        throw new Error('Invalid session data received from server');
    }
    
    return cookie;
}