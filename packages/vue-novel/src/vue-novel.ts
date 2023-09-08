import { type App, type Plugin } from 'vue'

import NovelEditor from './components/novel-editor.vue'

export const VueNovelPlugin: Plugin = {
  install(app: App, options: any) {
    app.config.globalProperties.$message = (msg: string) => {
      console.log(msg)
    }
    app.component('VueNovel', NovelEditor)
  }
}
