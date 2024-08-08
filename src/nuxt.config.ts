
const apiBaseURL = 'http://localhost:1873';

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