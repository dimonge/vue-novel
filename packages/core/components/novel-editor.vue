<template>
  <div>
    <bubble-menu
      class="flex w-fit divide-x divide-stone-200 rounded border border-stone-200 bg-white shadow-xl"
      v-if="editor"
      :editor="editor"
      @mousedown="(e) => handleEvent(e)"
      @keydown="(e) => handleEvent(e)"
      :tippy-options="{ duration: 100 }"
    >
      <button
        v-for="item in items"
        :key="item.name"
        @click="item.command()"
        :class="{ 'is-active': item.isActive() }"
        class="flex items-center justify-center w-10 h-10"
      >
        <component :is="item.icon" class="w-5 h-5" />
      </button>
    </bubble-menu>
    <editor-content
      :editor="editor"
      class="relative min-h-[500px] w-full max-w-screen-lg border-stone-200 bg-white p-12 px-8 sm:mb-[calc(20vh)] sm:rounded-lg sm:border sm:px-12 sm:shadow-lg"
    />
  </div>
</template>

<script lang="ts">
import '../styles/index.css'
import { defineComponent } from 'vue'
import { useEditor, EditorContent, BubbleMenu, Editor } from '@tiptap/vue-3'
import { InputRule } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import HorizontalRule from '@tiptap/extension-horizontal-rule'
import TiptapLink from '@tiptap/extension-link'
import TiptapImage from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import TiptapUnderline from '@tiptap/extension-underline'
import TextStyle from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'
import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list'
import { Markdown } from 'tiptap-markdown'
import Highlight from '@tiptap/extension-highlight'

import { BoldIcon, ItalicIcon, UnderlineIcon, StrikethroughIcon, CodeIcon } from 'lucide-vue-next'

import SlashCommand from './command/commands.js'
import suggestion from './command/suggestion.js'
import MenuSelectors from './bubble-menu/menu-selectors.vue'
import { fetchCompletion } from '../utils/ai'
import { defaultEditorContent } from '../editor/default-content'

export default defineComponent({
  name: 'VueNovel',
  components: {
    EditorContent,
    BubbleMenu
  },
  props: {
    extensions: {
      type: Array,
      default: () => []
    },
    content: {
      type: [String, null],
      default: null
    },
    customEditorMenu: {
      type: Array<{
        name: string
        isActive: () => boolean
        command: () => void
        icon: any
      }>,
      default: () => []
    },
    showDefaultMenu: {
      type: Boolean,
      default: true
    },
    editorProps: {
      type: Object,
      default: () => ({})
    },
    completeApi: {
      type: String,
      default: '/api/generate'
    },
    onUpdate: {
      type: Function,
      default: () => {}
    }
  },
  setup(props) {
    const editor = useEditor({
      content: props.content || defaultEditorContent,
      extensions: [
        StarterKit.configure({
          bulletList: {
            HTMLAttributes: {
              class: 'list-disc list-outside leading-3 -mt-2'
            }
          },
          orderedList: {
            HTMLAttributes: {
              class: 'list-decimal list-outside leading-3 -mt-2'
            }
          },
          listItem: {
            HTMLAttributes: {
              class: 'leading-normal -mb-2'
            }
          },
          blockquote: {
            HTMLAttributes: {
              class: 'border-l-4 border-stone-700'
            }
          },
          codeBlock: {
            HTMLAttributes: {
              class: 'rounded-sm bg-stone-100 p-5 font-mono font-medium text-stone-800'
            }
          },
          code: {
            HTMLAttributes: {
              class: 'rounded-md bg-stone-200 px-1.5 py-1 font-mono font-medium text-stone-900',
              spellcheck: 'false'
            }
          },
          horizontalRule: false,
          dropcursor: {
            color: '#DBEAFE',
            width: 4
          },
          gapcursor: false
        }),
        HorizontalRule.extend({
          addInputRules() {
            return [
              new InputRule({
                find: /^(?:---|—-|___\s|\*\*\*\s)$/,
                handler: ({ state, range }) => {
                  const attributes = {}

                  const { tr } = state
                  const start = range.from
                  let end = range.to

                  tr.insert(start - 1, this.type.create(attributes)).delete(
                    tr.mapping.map(start),
                    tr.mapping.map(end)
                  )
                }
              })
            ]
          }
        }).configure({
          HTMLAttributes: {
            class: 'mt-4 mb-6 border-t border-stone-300'
          }
        }),
        TextStyle,
        TiptapLink.configure({
          HTMLAttributes: {
            class:
              'text-stone-400 underline underline-offset-[3px] hover:text-stone-600 transition-colors cursor-pointer'
          }
        }),
        TiptapImage,
        Placeholder.configure({
          placeholder: ({ node }) => {
            if (node.type.name === 'heading') {
              return `Heading ${node.attrs.level}`
            }
            return "Press '/' for commands, or '++' for AI autocomplete..."
          },
          includeChildren: true
        }),
        Highlight.configure({
          multicolor: true
        }),
        TaskList.configure({
          HTMLAttributes: {
            class: 'not-prose pl-2'
          }
        }),
        TaskItem.configure({
          HTMLAttributes: {
            class: 'flex items-start my-4'
          },
          nested: true
        }),
        Placeholder.configure({
          placeholder: ({ node }) => {
            if (node.type.name === 'heading') {
              return `Heading ${node.attrs.level}`
            }
            return "Press '/' for commands, or '++' for AI autocomplete..."
          },
          includeChildren: true
        }),
        SlashCommand.configure({
          suggestion
        }),
        Markdown.configure({
          html: false,
          transformCopiedText: true
        }),
        TiptapUnderline,
        Color,
        ...props.extensions
      ],
      autofocus: 'end',
      ...props.editorProps
    })

    let editorMenu = ['bold', 'italic', 'underline', 'strike', 'code'].map((name: string) => {
      const icon = {
        bold: BoldIcon,
        italic: ItalicIcon,
        underline: UnderlineIcon,
        strike: StrikethroughIcon,
        code: CodeIcon
      }[name]
      return {
        name,
        isActive: () => editor.value.isActive(name),
        command: () => editor.value.chain().focus().toggleMark(name).run(),
        icon
      }
    })

    if (!props.showDefaultMenu) {
      editorMenu = props.customEditorMenu
    } else {
      editorMenu = [...editorMenu, ...props.customEditorMenu]
    }

    const handleEvent = async (event) => {
      // Perform your event check logic here
      if (event.type === 'mousedown' || event.keyCode === 'z') {
        const { from, to } = editor.value.state.selection
        const selectedText = editor.value.getText().substring(from, to)
        if (selectedText) {
          const completion = await fetchCompletion(selectedText)
          // Insert the completion into the editor
          editor.value.chain().insertContent(completion).run()
        }
      }
    }
    return {
      editor,
      items: editorMenu,
      handleEvent
    }
  }
})
</script>
