import { defineAsyncComponent, type App } from 'vue'
export default {
  install(app: App, options: any) {
    app.config.globalProperties.$message = (msg: string) => {
      console.log(msg)
    }
    app.component(
      'novel-editor',
      defineAsyncComponent(() => import('./components/novel-editor.vue'))
    )
  }
}
