// === DEFAULT / CUSTOM STYLE ===
// WARNING! always comment out ONE of the two require() calls below.
// 1. use next line to activate CUSTOM STYLE (./src/themes)
// require(`./themes/app.${__THEME}.styl`)
// 2. or, use next line to activate DEFAULT QUASAR STYLE
require(`quasar/dist/quasar.${__THEME}.css`)
// ==============================

// Uncomment the following lines if you need IE11/Edge support
// require(`quasar/dist/quasar.ie`)
// require(`quasar/dist/quasar.ie.${__THEME}.css`)

import Vue from 'vue'
import Quasar, { SessionStorage, Cookies, QTransition } from 'quasar'
import _ from 'lodash'
import router from './router'
import axios from './utils/axiosWrap'
import VueI18n from 'vue-i18n'
import langs from './translations'
import Vuelidate from 'vuelidate'
import filters from './utils/filters'
import VueClipboards from 'vue-clipboards'
import 'quasar-extras/animate/fadeIn.css'
import 'quasar-extras/animate/fadeOut.css'

// import AsyncComputed from 'vue-async-computed'
// Vue.use(AsyncComputed)

Vue.config.productionTip = false
Vue.use(Quasar, {
  components: {
    QTransition
  }
}) // Install Quasar Framework
Vue.use(VueI18n)
Vue.use(Vuelidate)
Vue.use(VueClipboards)

Vue.prototype.$http = axios
Vue.prototype.$session = SessionStorage
Vue.prototype.$cookies = Cookies
Vue.prototype._ = _

if (__THEME === 'mat') {
  require('quasar-extras/roboto-font')
}
// icons
import 'quasar-extras/material-icons'
// import 'quasar-extras/ionicons'
// import 'quasar-extras/fontawesome'
// import 'quasar-extras/animate'

const getLanguage = () => {
  let language = navigator.language
    ? navigator.language
    : navigator.browserLanguage ? navigator.browserLanguage : 'zh-cn'
  return language
}

// 判断用户使用的语言
const i18n = new VueI18n({
  locale: getLanguage()
    .toLowerCase()
    .split('-')[0], // set locale
  messages: langs // set locale messages
})

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Quasar.start(() => {
  /* eslint-disable no-new */
  new Vue({
    el: '#q-app',
    i18n,
    router,
    render: h => h(require('./App').default)
  })
})
