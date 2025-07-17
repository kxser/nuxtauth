export async function logout() {
    const sessionCookie = useCookie<string | null>("session");
    const sessionId = sessionCookie.value;

    await $fetch('/api/auth/logout', {
        method: 'POST',
        body: JSON.stringify({ sessionId })
    });
    
    sessionCookie.value = null;
    
    reloadNuxtApp();
}