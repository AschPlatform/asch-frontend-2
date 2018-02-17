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
import Quasar from 'quasar'
import router from './router'
import axios from 'axios'
import VueSessionStorage from 'vue-sessionstorage'
import VueI18n from 'vue-i18n'
import langs from './translations'
import Vuelidate from 'vuelidate'
import filters from './utils/filters'
// import AsyncComputed from 'vue-async-computed'

// Vue.use(AsyncComputed)

Vue.config.productionTip = false
Vue.use(Quasar) // Install Quasar Framework
Vue.use(VueSessionStorage) // sessionStorage
Vue.use(VueI18n)
Vue.use(Vuelidate)

Vue.prototype.$http = axios

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
  locale: getLanguage().toLowerCase().split('-')[0], // set locale
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
