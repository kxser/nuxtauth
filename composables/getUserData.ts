export async function getUserData() {
    const sessionCookie = useCookie<string | null>("session");
    const sessionId = sessionCookie.value;

    const userData = await $fetch('/api/auth/user', {
        method: 'POST',
        body: JSON.stringify({ sessionId })
    });


    return userData;
    

}