// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  css: ['~/assets/scss/main.scss'],
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss",'@pinia/nuxt'],
  runtimeConfig: {
    public: {
      key_jwt: process.env.JWT_SECRET_KEY,
      key_refresh_jwt: process.env.REFRESH_TOKEN_SECRET,
    },
  }
})