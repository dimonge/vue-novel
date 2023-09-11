// copied from https://github.com/steven-tey/novel/blob/main/packages/core/src/ui/editor/default-content.tsx
export const defaultEditorContent = {
  type: 'doc',
  content: [
    {
      type: 'heading',
      attrs: { level: 2 },
      content: [{ type: 'text', text: 'Introducing Vue-Novel' }]
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          marks: [
            {
              type: 'link',
              attrs: {
                href: 'https://github.com/dimonge/vue-novel',
                target: '_blank',
                class:
                  'text-stone-400 underline underline-offset-[3px] hover:text-stone-600 transition-colors cursor-pointer'
              }
            }
          ],
          text: 'Vue-Novel'
        },
        {
          type: 'text',
          text: " is a Vue based Notion-style WYSIWYG editor with AI-powered autocompletion. Inspired by Steven Tey's Novel AI powered Editor. This Editor is built with"
        },
        {
          type: 'text',
          marks: [
            {
              type: 'link',
              attrs: {
                href: 'https://tiptap.dev/',
                target: '_blank',
                class:
                  'text-stone-400 underline underline-offset-[3px] hover:text-stone-600 transition-colors cursor-pointer'
              }
            }
          ],
          text: ' Tiptap'
        },
        { type: 'text', text: ' + ' },
        {
          type: 'text',
          marks: [
            {
              type: 'link',
              attrs: {
                href: 'https://platform.openai.com/docs/guides/gpt/completions-api',
                target: '_blank',
                class:
                  'text-stone-400 underline underline-offset-[3px] hover:text-stone-600 transition-colors cursor-pointer text-stone-400 underline underline-offset-[3px] hover:text-stone-600 transition-colors cursor-pointer'
              }
            }
          ],
          text: 'Open AI Completion API'
        },
        { type: 'text', text: '.' }
      ]
    },
    {
      type: 'heading',
      attrs: { level: 3 },
      content: [{ type: 'text', text: 'Installation' }]
    },
    {
      type: 'codeBlock',
      attrs: { language: null },
      content: [{ type: 'text', text: 'npm i vue-novel' }]
    },
    {
      type: 'heading',
      attrs: { level: 3 },
      content: [{ type: 'text', text: 'Usage' }]
    },
    {
      type: 'paragraph',
      content: [{ type: 'text', text: "You can register the Vue Novel plugin in your app's root" }]
    },
    {
      type: 'codeBlock',
      attrs: { language: null },
      content: [
        {
          type: 'text',
          text: 'import { VueNovelPlugin } from "vue-novel";\n\napp.use(VueNovelPlugin);\n'
        }
      ]
    },
    {
      type: 'paragraph',
      content: [
        { type: 'text', text: 'Then, you can use the `vue-novel` component in your template:' }
      ]
    },
    {
      type: 'codeBlock',
      attrs: { language: null },
      content: [
        {
          type: 'text',
          text: '<template>\n  <div class="flex justify-center m-4">\n    <vue-novel></vue-novel>\n  </div>\n</template>\n\n<script lang="ts">\nimport "vue-novel/style.css";\n</script>'
        }
      ]
    },
    {
      type: 'heading',
      attrs: { level: 3 },
      content: [{ type: 'text', text: 'Features' }]
    },
    {
      type: 'orderedList',
      attrs: { tight: true, start: 1 },
      content: [
        {
          type: 'listItem',
          content: [
            {
              type: 'paragraph',
              content: [{ type: 'text', text: 'Slash menu & bubble menu' }]
            }
          ]
        },
        {
          type: 'listItem',
          content: [
            {
              type: 'paragraph',
              content: [{ type: 'text', text: 'AI autocomplete (select from slash menu)' }]
            }
          ]
        },
        {
          type: 'listItem',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'More features will be released this September. Stay tuned!'
                }
              ]
            }
          ]
        }
      ]
    },
    { type: 'horizontalRule' },
    {
      type: 'heading',
      attrs: { level: 3 },
      content: [{ type: 'text', text: 'Learn more' }]
    },
    {
      type: 'taskList',
      content: [
        {
          type: 'taskItem',
          attrs: { checked: false },
          content: [
            {
              type: 'paragraph',
              content: [
                { type: 'text', text: 'Star us on ' },
                {
                  type: 'text',
                  marks: [
                    {
                      type: 'link',
                      attrs: {
                        href: 'https://github.com/dimonge/vue-novel',
                        target: '_blank',
                        class:
                          'text-stone-400 underline underline-offset-[3px] hover:text-stone-600 transition-colors cursor-pointer'
                      }
                    }
                  ],
                  text: 'GitHub'
                }
              ]
            }
          ]
        },
        {
          type: 'taskItem',
          attrs: { checked: false },
          content: [
            {
              type: 'paragraph',
              content: [
                { type: 'text', text: 'Install the ' },
                {
                  type: 'text',
                  marks: [
                    {
                      type: 'link',
                      attrs: {
                        href: 'https://www.npmjs.com/package/vue-novel',
                        target: '_blank',
                        class:
                          'text-stone-400 underline underline-offset-[3px] hover:text-stone-600 transition-colors cursor-pointer'
                      }
                    }
                  ],
                  text: 'NPM package'
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}
