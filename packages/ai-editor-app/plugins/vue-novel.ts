import { defineNuxtPlugin } from "#app";
import { VueNovelPlugin } from "vue-novel";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(VueNovelPlugin);
});
