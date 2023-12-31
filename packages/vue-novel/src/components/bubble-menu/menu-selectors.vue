<template>
  <PopoverRoot>
    <PopoverTrigger
      className="flex h-full items-center gap-1 whitespace-nowrap p-2 text-sm font-medium text-stone-600 hover:bg-stone-100 active:bg-stone-200"
    >
      <span>{activeItems?.name}</span>
      <ChevronDown className="h-4 w-4" />
    </PopoverTrigger>

    <PopoverContent
      align="start"
      className="z-[99999] my-1 flex max-h-80 w-48 flex-col overflow-hidden overflow-y-auto rounded border border-stone-200 bg-white p-1 shadow-xl animate-in fade-in slide-in-from-top-1"
    >
      <button
        v-for="item in items"
        :key="item.name"
        @click="item.command()"
        class="flex items-center justify-between rounded-sm px-2 py-1 text-sm text-stone-600 hover:bg-stone-100"
      >
        <div className="flex items-center space-x-2">
          <div className="rounded-sm border border-stone-200 p-1">
            <item.icon className="h-3 w-3" />
          </div>
          <span>{item.name}</span>
        </div>
        <Check v-if="activeItem.name === item.name" className="h-4 w-4" />}
      </button>
    </PopoverContent>
  </PopoverRoot>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { Editor } from '@tiptap/vue-3'
import { PopoverContent, PopoverRoot, PopoverTrigger } from 'radix-vue'
import {
  Check,
  ChevronDown,
  Heading1,
  Heading2,
  Heading3,
  TextQuote,
  ListOrdered,
  TextIcon,
  Code,
  CheckSquare
} from 'lucide-vue-next'
export default defineComponent({
  components: {
    PopoverContent,
    PopoverRoot,
    PopoverTrigger,
    ChevronDown,
    Check
  },
  props: {
    editor: {
      type: Editor,
      required: true
    }
  },
  setup({ editor }) {
    const items = [
      {
        name: 'Text',
        icon: TextIcon,
        command: () => editor.value.chain().focus().toggleNode('paragraph', 'paragraph').run(),
        // I feel like there has to be a more efficient way to do this – feel free to PR if you know how!
        isActive: () =>
          editor.value.isActive('paragraph') &&
          !editor.value.isActive('bulletList') &&
          !editor.value.isActive('orderedList')
      },
      {
        name: 'Heading 1',
        icon: Heading1,
        command: () => editor.value.chain().focus().toggleHeading({ level: 1 }).run(),
        isActive: () => editor.value.isActive('heading', { level: 1 })
      },
      {
        name: 'Heading 2',
        icon: Heading2,
        command: () => editor.value.chain().focus().toggleHeading({ level: 2 }).run(),
        isActive: () => editor.value.isActive('heading', { level: 2 })
      },
      {
        name: 'Heading 3',
        icon: Heading3,
        command: () => editor.value.chain().focus().toggleHeading({ level: 3 }).run(),
        isActive: () => editor.value.isActive('heading', { level: 3 })
      },
      {
        name: 'To-do List',
        icon: CheckSquare,
        command: () => editor.value.chain().focus().toggleTaskList().run(),
        isActive: () => editor.value.isActive('taskItem')
      },
      {
        name: 'Bullet List',
        icon: ListOrdered,
        command: () => editor.value.chain().focus().toggleBulletList().run(),
        isActive: () => editor.value.isActive('bulletList')
      },
      {
        name: 'Numbered List',
        icon: ListOrdered,
        command: () => editor.value.chain().focus().toggleOrderedList().run(),
        isActive: () => editor.value.isActive('orderedList')
      },
      {
        name: 'Quote',
        icon: TextQuote,
        command: () =>
          editor.chain().focus().toggleNode('paragraph', 'paragraph').toggleBlockquote().run(),
        isActive: () => editor.value.isActive('blockquote')
      },
      {
        name: 'Code',
        icon: Code,
        command: () => editor.value.chain().focus().toggleCodeBlock().run(),
        isActive: () => editor.value.isActive('codeBlock')
      }
    ]
    const activeItem = items.filter((item) => item.isActive()).pop() ?? {
      name: 'Multiple'
    }
    return {
      items,
      activeItem
    }
  }
})
</script>
