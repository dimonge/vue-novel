import { VueRenderer } from '@tiptap/vue-3'
import tippy from 'tippy.js'
import { Wand2, MessageSquarePlus } from 'lucide-vue-next'
import CommandsList from './commands-list.vue'

interface CommandProps {
  editor: any
  range: Range
}

export default {
  items: ({ query }: { query: string }) => {
    return [
      {
        title: 'Continue writing',
        description: 'Use AI to expand your thoughts.',
        searchTerms: ['gpt'],
        icon: Wand2
      },
      {
        title: 'Send Feedback',
        description: 'Let us know how we can improve.',
        icon: MessageSquarePlus,
        command: ({ editor, range }: CommandProps) => {
          console.log('Send Feedback', editor, range)
          editor.chain().focus().deleteRange(range).run()
          window.open('/feedback', '_blank')
        }
      }
    ]
      .filter((item) => {
        if (typeof query === 'string' && query.length > 0) {
          const search = query.toLowerCase()
          return (
            item.title.toLowerCase().includes(search) ||
            item.description.toLowerCase().includes(search) ||
            (item.searchTerms && item.searchTerms.some((term: string) => term.includes(search)))
          )
        }
        return true
      })
      .slice(0, 10)
  },

  render: () => {
    let component
    let popup

    return {
      onStart: (props) => {
        component = new VueRenderer(CommandsList, {
          // using vue 2:
          // parent: this,
          // propsData: props,
          props,
          editor: props.editor
        })

        if (!props.clientRect) {
          return
        }

        popup = tippy('body', {
          getReferenceClientRect: props.clientRect,
          appendTo: () => document.body,
          content: component.element,
          showOnCreate: true,
          interactive: true,
          trigger: 'manual',
          placement: 'bottom-start'
        })
      },

      onUpdate(props) {
        component.updateProps(props)

        if (!props.clientRect) {
          return
        }

        popup[0].setProps({
          getReferenceClientRect: props.clientRect
        })
      },

      onKeyDown(props) {
        if (props.event.key === 'Escape') {
          popup[0].hide()

          return true
        }

        return component.ref?.onKeyDown(props)
      },

      onExit() {
        popup[0].destroy()
        component.destroy()
      }
    }
  }
}
