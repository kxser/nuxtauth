export async function register(userData: { username: string; password: string; email: string; recoveryPhrase: string }) {
    const { $csrfFetch } = useNuxtApp();

    const registrationStatus = await $csrfFetch('/api/auth/register', {
        method: 'POST',
        body: userData
    });
    return registrationStatus;
}