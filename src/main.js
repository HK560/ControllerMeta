import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

// Set favicon
import faviconUrl from './assets/images/ControllerMeta.ico'
const link = document.createElement('link')
link.rel = 'icon'
link.href = faviconUrl
document.head.appendChild(link)

import i18n from './i18n'

createApp(App).use(i18n).mount('#app')
