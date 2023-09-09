<template>
  <div class="items">
    <template v-if="items.length">
      <button
        v-for="(item, index) in items"
        :key="index"
        :class="{ 'is-selected': index === selectedIndex }"
        class="item"
        @click="selectItem(index)"
      >
        <div class="flex flex-row">
          <component v-if="item.icon" :is="item.icon" class="w-5 h-5 mr-2" />
          {{ item?.title }}
        </div>
      </button>
    </template>
    <div class="item" v-else>No result</div>
  </div>
</template>

<script>
import { Editor } from '@tiptap/vue-3'
import VA from '@vercel/analytics'

import { fetchCompletion } from '../../utils/completion-ai'

export default {
  props: {
    items: {
      type: Array,
      required: true
    },

    command: {
      type: Function,
      required: true
    },
    editor: {
      type: Editor,
      required: true
    }
  },

  data() {
    return {
      selectedIndex: 0
    }
  },

  watch: {
    items() {
      this.selectedIndex = 0
    }
  },

  methods: {
    onKeyDown({ event }) {
      if (event.key === 'ArrowUp') {
        this.upHandler()
        return true
      }

      if (event.key === 'ArrowDown') {
        this.downHandler()
        return true
      }

      if (event.key === 'Enter') {
        this.enterHandler()
        return true
      }

      return false
    },

    upHandler() {
      this.selectedIndex = (this.selectedIndex + this.items.length - 1) % this.items.length
    },

    downHandler() {
      this.selectedIndex = (this.selectedIndex + 1) % this.items.length
    },

    enterHandler() {
      this.selectItem(this.selectedIndex)
    },

    async selectItem(index) {
      const item = this.items[index]
      VA.track('Slash Command Used', {
        command: item.title
      })
      if (item?.searchTerms?.includes('gpt')) {
        VA.track('GPT-3 Command Used', {
          command: item.title
        })
        //const { from, to } = this.editor.view.state.selection
        //const selectedText = this.editor.getText().substring(from, to)
        const completion = await fetchCompletion(this.editor.getText())
        // Insert the completion into the editor
        this.editor.chain().insertContent(completion).run()
      } else if (item.command) {
        this.command(item)
      }
    }
  }
}
</script>

<style lang="scss">
.items {
  padding: 0.2rem;
  position: relative;
  border-radius: 0.5rem;
  background: #fff;
  color: rgba(0, 0, 0, 0.8);
  overflow: hidden;
  font-size: 0.9rem;
  box-shadow:
    0 0 0 1px rgba(0, 0, 0, 0.05),
    0px 10px 20px rgba(0, 0, 0, 0.1);
}

.item {
  display: block;
  margin: 0;
  width: 100%;
  text-align: left;
  background: transparent;
  border-radius: 0.4rem;
  border: 1px solid transparent;
  padding: 0.2rem 0.4rem;

  &.is-selected {
    border-color: #000;
  }
}
</style>
../../utils/completion-ai
