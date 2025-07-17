export default defineNuxtRouteMiddleware(async (to, from) => {
  const guestRoutes = useRuntimeConfig().public.guestRoutes.split(",");
  if (guestRoutes.includes(to.path)) {
    return;
  } else {
    const sessionId = useCookie("session").value;
    
    if (!sessionId) {
      return navigateTo("/");
    }
    
    const sessionStatus = await $fetch("/api/auth/session", {
        method: "GET",
        query: { sessionId }
    });
    
    if (!sessionStatus || sessionStatus === null) {
      return navigateTo("/")
    }
  }
});