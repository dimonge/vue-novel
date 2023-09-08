<template>
  <div>
    <bubble-menu
      class="flex w-fit divide-x divide-stone-200 rounded border border-stone-200 bg-white shadow-xl"
      v-if="editor"
      :editor="editor"
      :tippy-options="{ duration: 100 }"
    >
      <button @mousedown="(e) => handleEvent(e)" class="flex items-center justify-center w-10 h-10">
        <Wand2 class="w-5 h-5" />
      </button>
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
    <floating-menu
      class="floating-menu"
      :tippy-options="{ duration: 100, placement: 'top' }"
      v-if="editor"
      :editor="editor"
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
    </floating-menu>
    <editor-content
      :editor="editor"
      class="relative min-h-[500px] w-full max-w-screen-lg border-stone-200 bg-white p-12 px-8 sm:mb-[calc(20vh)] sm:rounded-lg sm:border sm:px-12 sm:shadow-lg"
    />
  </div>
</template>

<script lang="ts">
import '../styles/tailwind.css'
import { defineComponent } from 'vue'
import { useEditor, EditorContent, BubbleMenu, Editor, FloatingMenu } from '@tiptap/vue-3'
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

import {
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
  StrikethroughIcon,
  CodeIcon,
  Wand2
} from 'lucide-vue-next'

import SlashCommand from './command/commands.js'
import suggestion from './command/suggestion.js'
import { fetchCompletion } from '../utils/completion-ai'
import { defaultEditorContent } from '../editor/default-content'

export default defineComponent({
  name: 'NovelEditor',
  components: {
    EditorContent,
    BubbleMenu,
    FloatingMenu,
    Wand2
  },
  props: {
    extensions: {
      type: Array,
      default: () => []
    },
    initialContent: {
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
    customEditorProps: {
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
    },
    useServerAPI: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const editor = useEditor({
      content: props.initialContent || defaultEditorContent,
      editorProps: {
        attributes: {
          class:
            'prose dark:prose-invert prose-sm sm:prose-base lg:prose-lg xl:prose-2xl m-5 focus:outline-none'
        }
      },
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
        TiptapImage.configure({
          allowBase64: true,
          HTMLAttributes: {
            class: 'rounded-lg border border-stone-200 mt-6'
          }
        }),
        Placeholder.configure({
          placeholder: ({ node }) => {
            if (node.type.name === 'heading') {
              return `Heading ${node.attrs.level}`
            }
            return "Press '/' for commands AI autocomplete..."
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
      ...props.customEditorProps
    })

    let editorMenu: Array<{
      name: string
      isActive: () => boolean
      command: () => void
      icon: any
    }> = ['bold', 'italic', 'underline', 'strike', 'code'].map((name: string) => {
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
      editorMenu = editorMenu.concat(props.customEditorMenu)
    }

    const handleEvent = async (event: any) => {
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

<style lang="scss">
.editor {
  background-color: #fff;
  border: 3px solid #0d0d0d;
  border-radius: 0.75rem;
  color: #0d0d0d;
  display: flex;
  flex-direction: column;
  max-height: 26rem;

  &__header {
    align-items: center;
    background: #0d0d0d;
    border-bottom: 3px solid #0d0d0d;
    border-top-left-radius: 0.25rem;
    border-top-right-radius: 0.25rem;
    display: flex;
    flex: 0 0 auto;
    flex-wrap: wrap;
    padding: 0.25rem;
  }

  &__content {
    flex: 1 1 auto;
    overflow-x: hidden;
    overflow-y: auto;
    padding: 1.25rem 1rem;
    -webkit-overflow-scrolling: touch;
  }

  &__footer {
    align-items: center;
    border-top: 3px solid #0d0d0d;
    color: #0d0d0d;
    display: flex;
    flex: 0 0 auto;
    flex-wrap: wrap;
    font-size: 12px;
    font-weight: 600;
    justify-content: space-between;
    padding: 0.25rem 0.75rem;
    white-space: nowrap;
  }

  /* Some information about the status */
  &__status {
    align-items: center;
    border-radius: 5px;
    display: flex;

    &::before {
      background: rgba(#0d0d0d, 0.5);
      border-radius: 50%;
      content: ' ';
      display: inline-block;
      flex: 0 0 auto;
      height: 0.5rem;
      margin-right: 0.5rem;
      width: 0.5rem;
    }

    &--connecting::before {
      background: #616161;
    }

    &--connected::before {
      background: #b9f18d;
    }
  }

  &__name {
    button {
      background: none;
      border: none;
      border-radius: 0.4rem;
      color: #0d0d0d;
      font: inherit;
      font-size: 12px;
      font-weight: 600;
      padding: 0.25rem 0.5rem;

      &:hover {
        background-color: #0d0d0d;
        color: #fff;
      }
    }
  }
}

/* Basic editor styles */
.tiptap {
  > * + * {
    margin-top: 0.75em;
  }

  ul,
  ol {
    padding: 0 1rem;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    line-height: 1.1;
  }

  code {
    background-color: rgba(#616161, 0.1);
    color: #616161;
  }

  pre {
    background: #0d0d0d;
    border-radius: 0.5rem;
    color: #fff;
    font-family: 'JetBrainsMono', monospace;
    padding: 0.75rem 1rem;

    code {
      background: none;
      color: inherit;
      font-size: 0.8rem;
      padding: 0;
    }
  }

  mark {
    background-color: #faf594;
  }

  img {
    height: auto;
    max-width: 100%;
  }

  hr {
    margin: 1rem 0;
  }

  blockquote {
    border-left: 2px solid rgba(#0d0d0d, 0.1);
    padding-left: 1rem;
  }

  hr {
    border: none;
    border-top: 2px solid rgba(#0d0d0d, 0.1);
    margin: 2rem 0;
  }

  ul[data-type='taskList'] {
    list-style: none;
    padding: 0;

    li {
      align-items: center;
      display: flex;

      > label {
        flex: 0 0 auto;
        margin-right: 0.5rem;
        user-select: none;
      }

      > div {
        flex: 1 1 auto;
      }
    }
  }
}
.floating-menu {
  display: flex;
  background-color: #ffffff;
  padding: 0.1rem;
  border-radius: 0.1rem;
  border: 1px solid #0d0d0d10;
  button {
    border: none;
    background: none;
    font-size: 0.85rem;
    font-weight: 500;
    padding: 0 0.2rem;
    opacity: 0.6;

    &:hover,
    &.is-active {
      opacity: 1;
    }
  }
}
.tiptap p.is-empty::before {
  color: #adb5bd;
  content: attr(data-placeholder);
  float: left;
  height: 0;
  pointer-events: none;
}
</style>
