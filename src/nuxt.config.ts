
const apiBaseURL = 'http://localhost:3000';

export default defineNuxtConfig({
  devServer: {
    port: 1873,
  },
  runtimeConfig: {
    public: {
      apiBase: apiBaseURL,
    },
  },
  plugins: ["@/plugins/axios.ts"],
  components: true,
  typescript: {
    strict: true,
  },
  modules: ["@vueuse/motion/nuxt", "@pinia/nuxt", '@nuxt/image', 'nuxt-delay-hydration'],
  pinia: {
    autoImports: ["defineStore"],
  },
  experimental: {
    appManifest: false
  },
  devtools: { enabled: true },
});

// export default defineNuxtConfig({
//   buildModules: ['@nuxt/typescript-build'],
//   modules: ['@nuxtjs/axios'],
//   axios: {
//     baseURL: 'http://localhost:3000', // Point to the backend server
//   },
//   typescript: {
//     typeCheck: true,
//     ignoreNotFoundWarnings: true,
//   },
// });