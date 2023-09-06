<template>
  <div class="flex justify-center m-4">
    <NovelEditor></NovelEditor>
  </div>
</template>

<script lang="ts">
import novelEditorVue from "~/packages/vue-novel/src/components/novel-editor.vue";
export default {
  components: {
    NovelEditor: novelEditorVue,
  },
};
</script>

<style></style>
