// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  env: {
    openaiApiKey: process.env.OPENAI_API_KEY,
  },
  build: {
    transpile: ["radix-vue"],
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  css: ["~/main.css"],
  serverMiddleware: ["~/server/openai-api.js"],
});
