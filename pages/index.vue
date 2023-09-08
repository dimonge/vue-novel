<template>
  <div class="flex justify-center m-4">
    <VueNovel></VueNovel>
  </div>
</template>

<script lang="ts">
import { VueNovel } from "vue-novel";
export default defineComponent({
  components: {
    VueNovel,
  },
});
</script>

<style></style>
