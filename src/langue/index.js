import Vue from 'vue'
import VueI18n from 'vue-i18n'
import VueCookie from 'vue-cookie'
import elementEnLocale from 'element-ui/lib/locale/lang/en' // element-ui lang
import elementZhLocale from 'element-ui/lib/locale/lang/zh-CN'// element-ui lang
import enLocale from './lang/en'
import zhLocale from './lang/cn'
import ElementLocale from 'element-ui/lib/locale'

// Tell Vue to use the plugin
Vue.use(VueCookie)
Vue.use(VueI18n)

const messages = {
  'en-US': {
    ...enLocale,
    ...elementEnLocale
  },
  'zh-CN': {
    ...zhLocale,
    ...elementZhLocale
  }
}

const i18n = new VueI18n({
  locale: 'zh-CN', // set locale
  messages // set locale messages
})

ElementLocale.i18n((key, value) => i18n.t(key, value))

export default i18n
