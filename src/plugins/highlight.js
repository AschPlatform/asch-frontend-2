// import something here
import VueCodeMirror from 'vue-codemirror-lite'
import 'codemirror/mode/javascript/javascript'
import 'codemirror/mode/vue/vue'

import 'codemirror/addon/hint/show-hint.js'
import 'codemirror/addon/hint/show-hint.css'
import 'codemirror/addon/hint/javascript-hint.js'

// leave the export, even if you don't use it
export default ({
  app,
  router,
  Vue
}) => {
  Vue.use(VueCodeMirror)
}
