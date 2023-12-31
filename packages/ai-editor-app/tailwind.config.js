/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./nuxt.config.{js,ts}",
    "./app.vue",
    "./packages/vue-novel/src/components/*.{js,vue,ts}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
