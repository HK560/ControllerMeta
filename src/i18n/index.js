import { createI18n } from 'vue-i18n'
import en from './locales/en.json'
import zh from './locales/zh.json'

let savedLocale = 'zh'
try {
  savedLocale = localStorage.getItem('user-locale') || 'zh'
} catch (e) {
  console.warn('localStorage is not accessible:', e)
}


const i18n = createI18n({
  legacy: false, // use Composition API
  locale: savedLocale || 'zh', // set locale
  fallbackLocale: 'en', // set fallback locale
  messages: {
    en,
    zh
  }
})

export default i18n
