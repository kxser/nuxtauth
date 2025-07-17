export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  runtimeConfig: {
    public: { 
      guestRoutes: process.env.NUXT_PUBLIC_GUEST_ROUTES ?? ""
    },
  },  
  modules: ['@nuxt/ui', 'nuxt-csurf'],
  css: ['./main.css'],
  devtools: { enabled: true },
  nitro: {
    experimental: {
      database: true
    }
  },
  csurf: {
    https: false,
    cookie: {
      path: '/',
      httpOnly: true,
      sameSite: 'strict'
    },
    methodsToProtect: ['POST', 'PUT', 'PATCH'],
    addCsrfTokenToEventCtx: true,
    headerName: 'csrf-token'
  }
});