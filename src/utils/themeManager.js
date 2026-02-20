import { ref } from 'vue'

// Singleton reactive state — shared across all component instances
const bgImage = ref('')
const bgFit = ref('cover')       // 'cover' | 'contain' | 'center' | 'tile'
const bgBrightness = ref(1)      // 0.2 – 1.5
const bgBlur = ref(0)            // 0 – 20 px
const glassEnabled = ref(false)
const glassOpacity = ref(0.75)   // 0.1 – 0.98
const glassBlur = ref(14)        // 0 – 30 px

let _glassObserver = null

// Whether we're running inside WebView2
function isWebView2() {
  return !!(window.chrome && window.chrome.webview)
}

// Derive CSS background-size / position / repeat from the fit preset
function fitToCSS(fit) {
  switch (fit) {
    case 'contain': return { size: 'contain', position: 'center', repeat: 'no-repeat' }
    case 'center':  return { size: 'auto',    position: 'center', repeat: 'no-repeat' }
    case 'tile':    return { size: 'auto',    position: 'top left', repeat: 'repeat' }
    default:        return { size: 'cover',   position: 'center', repeat: 'no-repeat' }
  }
}

// ─── IPC helpers ─────────────────────────────────────────────
// One-shot response listener: registers a handler for a single message type,
// calls it once, then removes itself.
function onceIPC(type, callback) {
  if (!isWebView2()) return
  const handler = (event) => {
    try {
      const msg = typeof event.data === 'string' ? JSON.parse(event.data) : event.data
      if (msg && msg.type === type) {
        window.chrome.webview.removeEventListener('message', handler)
        callback(msg)
      }
    } catch (e) { /* ignore parse errors */ }
  }
  window.chrome.webview.addEventListener('message', handler)
}

function ipcSend(obj) {
  window.chrome.webview.postMessage(JSON.stringify(obj))
}

// ─── Non-image settings (small, safe for localStorage) ───────
const SETTINGS_KEYS = {
  bgFit:        'user-bg-fit',
  bgBrightness: 'user-bg-brightness',
  bgBlur:       'user-bg-blur',
  glassEnabled: 'user-glass-enabled',
  glassOpacity: 'user-glass-opacity',
  glassBlur:    'user-glass-blur',
}

function loadSettingsFromStorage() {
  try {
    bgFit.value        = localStorage.getItem(SETTINGS_KEYS.bgFit) || 'cover'
    bgBrightness.value = parseFloat(localStorage.getItem(SETTINGS_KEYS.bgBrightness) ?? '1')
    bgBlur.value       = parseFloat(localStorage.getItem(SETTINGS_KEYS.bgBlur) ?? '0')
    glassEnabled.value = localStorage.getItem(SETTINGS_KEYS.glassEnabled) === 'true'
    glassOpacity.value = parseFloat(localStorage.getItem(SETTINGS_KEYS.glassOpacity) ?? '0.75')
    glassBlur.value    = parseFloat(localStorage.getItem(SETTINGS_KEYS.glassBlur) ?? '14')
  } catch (e) {
    console.error('Failed to load settings from localStorage:', e)
  }
}

function saveSettingsToStorage() {
  try {
    localStorage.setItem(SETTINGS_KEYS.bgFit,        bgFit.value)
    localStorage.setItem(SETTINGS_KEYS.bgBrightness, String(bgBrightness.value))
    localStorage.setItem(SETTINGS_KEYS.bgBlur,       String(bgBlur.value))
    localStorage.setItem(SETTINGS_KEYS.glassEnabled, String(glassEnabled.value))
    localStorage.setItem(SETTINGS_KEYS.glassOpacity, String(glassOpacity.value))
    localStorage.setItem(SETTINGS_KEYS.glassBlur,    String(glassBlur.value))
  } catch (e) {
    console.error('Failed to save settings to localStorage:', e)
  }
}

// ─── Public API ───────────────────────────────────────────────

export function loadTheme() {
  // Always load non-image settings from localStorage (tiny, no quota issues)
  loadSettingsFromStorage()

  // Load background image
  if (isWebView2()) {
    // Request from backend file storage; apply when response arrives
    onceIPC('bg_image_data', (msg) => {
      bgImage.value = msg.data || ''
      applyTheme()
    })
    ipcSend({ type: 'load_bg_image' })
  } else {
    // Fallback: try localStorage (may fail for large images)
    try {
      bgImage.value = localStorage.getItem('user-bg-image') || ''
    } catch (e) {
      bgImage.value = ''
    }
    applyTheme()
  }
}

export function applyTheme() {
  const root = document.documentElement
  const css = fitToCSS(bgFit.value)

  root.style.setProperty('--cs-bg-image',      bgImage.value ? `url("${bgImage.value}")` : 'none')
  root.style.setProperty('--cs-bg-size',        css.size)
  root.style.setProperty('--cs-bg-position',    css.position)
  root.style.setProperty('--cs-bg-repeat',      css.repeat)
  root.style.setProperty('--cs-bg-brightness',  String(bgBrightness.value))
  root.style.setProperty('--cs-bg-blur',        `${bgBlur.value}px`)
  root.style.setProperty('--cs-glass-opacity',  String(glassOpacity.value))
  root.style.setProperty('--cs-glass-blur',     `${glassBlur.value}px`)

  // Toggle background layer visibility via class
  if (bgImage.value) {
    root.classList.add('has-bg')
  } else {
    root.classList.remove('has-bg')
  }

  const glassActive = glassEnabled.value && !!bgImage.value
  if (glassActive) {
    root.setAttribute('data-glass', 'true')
  } else {
    root.removeAttribute('data-glass')
  }

  // Apply backdrop-filter directly on glass elements to avoid CSS variable
  // resolution issues with backdrop-filter in some WebView2 builds.
  // Use a short delay + MutationObserver to catch dynamically rendered cards.
  const blurVal = `blur(${glassBlur.value}px) saturate(1.4)`
  const glassSelectors = ['.cs-card', '.app-nav', '.app-header', '.cs-dialog-panel']

  function applyGlassToElements() {
    glassSelectors.forEach(sel => {
      document.querySelectorAll(sel).forEach(el => {
        if (glassActive) {
          el.style.backdropFilter = blurVal
          el.style.webkitBackdropFilter = blurVal
        } else {
          el.style.backdropFilter = ''
          el.style.webkitBackdropFilter = ''
        }
      })
    })
  }

  applyGlassToElements()

  // Also watch for new cards being added to the DOM (view switches)
  if (_glassObserver) _glassObserver.disconnect()
  if (glassActive) {
    _glassObserver = new MutationObserver(applyGlassToElements)
    _glassObserver.observe(document.body, { childList: true, subtree: true })
  } else {
    _glassObserver = null
  }
}

export function saveTheme() {
  // Always save non-image settings to localStorage
  saveSettingsToStorage()

  // Save background image
  if (isWebView2()) {
    ipcSend({ type: 'save_bg_image', data: bgImage.value })
  } else {
    try {
      if (bgImage.value) {
        localStorage.setItem('user-bg-image', bgImage.value)
      } else {
        localStorage.removeItem('user-bg-image')
      }
    } catch (e) {
      console.error('Failed to save bg image to localStorage (quota exceeded):', e)
    }
  }
}

export function useTheme() {
  return { bgImage, bgFit, bgBrightness, bgBlur, glassEnabled, glassOpacity, glassBlur }
}
