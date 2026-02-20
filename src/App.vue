<template>
  <!-- ─── Overlay Mode (OBS Browser Source) ──────────────────────────────── -->
  <!-- 覆盖层模式：仅在 OBS Browser Source 中使用，背景透明，只显示摇杆图 -->
  <OverlayView
    v-if="isOverlayMode"
    :leftStickBatch="leftStickBatch"
    :rightStickBatch="rightStickBatch"
    :maxPoints="overlayMaxPoints"
    :resetSignal="overlayResetSignal"
  />

  <!-- ─── Gamepad Overlay Mode (OBS Browser Source) ─────────────────────────── -->
  <!-- 完整手柄覆盖层模式：显示按键/扳机/摇杆布局，背景透明，供 OBS Browser Source 使用 -->
  <GamepadOverlayView
    v-else-if="isGamepadOverlayMode"
    :buttons="state.buttons"
    :leftStickX="state.leftStickCurrent.x"
    :leftStickY="state.leftStickCurrent.y"
    :rightStickX="state.rightStickCurrent.x"
    :rightStickY="state.rightStickCurrent.y"
    :profileName="state.profileName"
    :triggerL="state.triggerL"
    :triggerR="state.triggerR"
  />

  <!-- ─── Normal App ──────────────────────────────────────────────────────── -->
  <template v-else>
  <!-- Fixed background image layer (behind everything) -->
  <div class="app-bg-wrapper" aria-hidden="true">
    <div class="app-bg"></div>
  </div>

  <div class="app-root flex h-screen w-full min-w-[900px] min-h-[600px]" style="background-color:var(--cs-bg-primary)">
    <!-- ─── Side Navigation ────────────────────────────────────── -->
    <nav class="app-nav w-16 flex flex-col items-center py-4 border-r border-(--cs-border) bg-(--cs-bg-card) shrink-0 z-10">
      <!-- App Logo / Icon -->
      <div class="mb-8 p-2 rounded-xl bg-[var(--cs-accent-blue)]/10 border border-[var(--cs-accent-blue)]/20 text-[var(--cs-accent-blue)]">
        <img :src="appIcon" alt="Logo" class="h-6 w-6 object-contain" />
      </div>

      <!-- Nav Items -->
      <div class="flex-1 w-full flex flex-col items-center gap-4">
        <!-- Dashboard (Active) -->
        <button 
          @click="state.currentView = 'dashboard'"
          class="p-3 rounded-xl transition-all hover:scale-105 active:scale-95 group relative"
          :class="state.currentView === 'dashboard' ? 'bg-[var(--cs-accent-blue)] text-white shadow-lg shadow-blue-900/20' : 'text-[var(--cs-text-secondary)] hover:bg-[var(--cs-bg-card-hover)] hover:text-[var(--cs-text-primary)]'"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
          <span class="absolute left-full ml-3 px-2 py-1 bg-(--cs-bg-tooltip) text-(--cs-text-tooltip) text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-20 border border-[var(--cs-border)]">{{ $t('nav.dashboard') }}</span>
        </button>



        <!-- Tests -->
        <button 
          @click="state.currentView = 'tests'"
          class="p-3 rounded-xl transition-all hover:scale-105 active:scale-95 group relative"
          :class="state.currentView === 'tests' ? 'bg-[var(--cs-accent-blue)] text-white shadow-lg shadow-blue-900/20' : 'text-[var(--cs-text-secondary)] hover:bg-[var(--cs-bg-card-hover)] hover:text-[var(--cs-text-primary)]'"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
           <span class="absolute left-full ml-3 px-2 py-1 bg-(--cs-bg-tooltip) text-(--cs-text-tooltip) text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-20 border border-[var(--cs-border)]">{{ $t('tests.nav_title') }}</span>
        </button>
        
        <!-- Logs / Debug -->
        <button 
          @click="state.currentView = 'logs'"
          class="p-3 rounded-xl transition-all hover:scale-105 active:scale-95 group relative"
          :class="state.currentView === 'logs' ? 'bg-[var(--cs-accent-blue)] text-white shadow-lg shadow-blue-900/20' : 'text-[var(--cs-text-secondary)] hover:bg-[var(--cs-bg-card-hover)] hover:text-[var(--cs-text-primary)]'"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
           <span class="absolute left-full ml-3 px-2 py-1 bg-(--cs-bg-tooltip) text-(--cs-text-tooltip) text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-20 border border-[var(--cs-border)]">{{ $t('nav.logs') }}</span>
        </button>
        <!-- Settings -->
        <button
          @click="state.currentView = 'settings'"
          class="p-3 rounded-xl transition-all hover:scale-105 active:scale-95 group relative"
          :class="state.currentView === 'settings' ? 'bg-(--cs-accent-blue) text-white shadow-lg shadow-blue-900/20' : 'text-(--cs-text-secondary) hover:bg-(--cs-bg-card-hover) hover:text-(--cs-text-primary)'"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span class="absolute left-full ml-3 px-2 py-1 bg-(--cs-bg-tooltip) text-(--cs-text-tooltip) text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-20 border border-(--cs-border)">{{ $t('nav.settings') }}</span>
        </button>
      </div>

      <!-- Info -->
      <button
        @click="state.currentView = 'info'"
        class="mt-auto p-3 rounded-xl transition-all relative group"
        :class="state.currentView === 'info' ? 'bg-(--cs-accent-blue) text-white shadow-lg shadow-blue-900/20' : 'text-(--cs-text-secondary) hover:bg-(--cs-bg-card-hover) hover:text-(--cs-text-primary)'"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span class="absolute left-full ml-3 px-2 py-1 bg-(--cs-bg-tooltip) text-(--cs-text-tooltip) text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-20 border border-(--cs-border)">{{ $t('nav.info') }}</span>
      </button>
    </nav>

    <!-- ─── Main Content ────────────────────────────────────────── -->
    <main class="app-main flex-1 flex flex-col min-w-0">

      <!-- Top Header -->
      <header class="app-header h-14 border-b border-(--cs-border) bg-(--cs-bg-card) flex items-center justify-between px-6 shrink-0 z-10">
         <div class="flex items-center gap-3">
          <div class="text-lg font-black tracking-tight">
            <span class="text-[var(--cs-accent-blue)]">Controller</span><span class="text-[var(--cs-text-primary)]">Meta</span>
          </div>
          <div class="hidden md:block h-4 w-px bg-[var(--cs-border)]"></div>
          <span class="text-[10px] text-[var(--cs-text-secondary)] cs-mono">v{{ version }}</span>

          <div class="hidden md:block h-4 w-px bg-[var(--cs-border)]"></div>
          <span
            class="text-[10px] text-[var(--cs-text-secondary)] cs-mono cursor-pointer hover:text-[var(--cs-accent-blue)] transition-colors"
            @click="openExternalLink('https://www.elbadaernu.com')"
          >
            Developed by HK560
          </span>
        </div>

        <div class="flex items-center gap-2 flex-wrap justify-center">
          <span class="inline-block w-2 h-2 rounded-full animate-pulse"
            :class="state.connected ? 'bg-[var(--cs-accent-green)]' : 'bg-[var(--cs-accent-red)]'"
          ></span>
          <DeviceSelector
            v-if="state.devices.length > 0"
            :devices="state.devices"
            :selected-id="state.selectedDeviceId"
            @select="handleSelectDevice"
          />
          <span v-else class="text-xs text-[var(--cs-text-secondary)] mr-2 truncate">
            {{ state.connected ? state.deviceName : $t('status.no_device') }}
          </span>
          <span 
            class="text-[10px] cs-mono uppercase px-1.5 py-0.5 rounded border mr-1"
            :class="state.hidActive ? 'text-[var(--cs-accent-blue)] border-[var(--cs-accent-blue)]/30 bg-[var(--cs-accent-blue)]/10' : 'text-[var(--cs-text-secondary)] border-[var(--cs-border)]'"
          >
            HID: {{ state.hidActive ? $t('status.active') : $t('status.na') }}
          </span>
          <span 
            class="text-[10px] cs-mono uppercase px-1.5 py-0.5 rounded border"
            :class="state.xinputActive ? 'text-[var(--cs-accent-green)] border-[var(--cs-accent-green)]/30 bg-[var(--cs-accent-green)]/10' : 'text-[var(--cs-text-secondary)] border-[var(--cs-border)]'"
          >
            XInput: {{ state.xinputActive ? $t('status.active') : $t('status.na') }}
          </span>
          <!-- <span 
            class="text-[10px] cs-mono uppercase px-1.5 py-0.5 rounded border"
            :class="state.dinputActive ? 'text-[var(--cs-accent-purple)] border-[var(--cs-accent-purple)]/30 bg-[var(--cs-accent-purple)]/10' : 'text-[var(--cs-text-secondary)] border-[var(--cs-border)]'"
          >
            DInput: {{ state.dinputActive ? $t('status.active') : $t('status.na') }}
          </span> -->
          <button
            v-if="!state.connected"
            @click="startMockMode"
            class="ml-2 px-3 py-1 text-[10px] rounded bg-[var(--cs-accent-blue)]/20 text-[var(--cs-accent-blue)] border border-[var(--cs-accent-blue)]/30 hover:bg-[var(--cs-accent-blue)]/30 transition-colors"
          >
            {{ $t('dashboard.demo') }}
          </button>
          <button
            v-if="state.isMockMode"
            @click="stopMockMode"
            class="ml-2 px-3 py-1 text-[10px] rounded bg-(--cs-accent-red)/20 text-(--cs-accent-red) border border-(--cs-accent-red)/30 hover:bg-(--cs-accent-red)/30 transition-colors"
          >
            {{ $t('dashboard.stop_demo') }}
          </button>
        </div>
      </header>

      <!-- Content Area -->
      <div class="flex-1 overflow-y-auto overflow-x-auto p-4 min-h-0">
        
        <!-- View: DASHBOARD -->
        <DashboardView
          ref="dashboardViewRef"
          v-show="state.currentView === 'dashboard'"
          :state="state"
          :leftStickBatch="leftStickBatch"
          :rightStickBatch="rightStickBatch"
          :mockProfileId="mockProfileId"
          :isActive="state.currentView === 'dashboard'"
          @startTest="handleStartTest"
          @rumble="handleRumble"
          @toggleLinkage="handleToggleLinkage"
          @clearHistory="handleClearHistory"
          @mockProfileSelect="handleMockProfileSelect"
        />

        <!-- View: LOGS -->
        <LogsView 
          v-show="state.currentView === 'logs'"
          :history="state.logHistory"
          @clear="state.logHistory = []"
        />

        <!-- View: TESTS -->
        <ResolutionTestView
          v-show="state.currentView === 'tests'"
          :state="state"
          :isActive="state.currentView === 'tests'"
        />

        <!-- View: INFO -->
        <InfoView 
          v-show="state.currentView === 'info'"
          :logs="state.backendLogs"
        />

        <!-- View: SETTINGS -->
        <SettingsView 
          v-show="state.currentView === 'settings'"
        />

      </div>
    </main>
  </div>
  <ToastNotification ref="toastRef" />
  <ConfirmDialog ref="confirmDialogRef" />
  </template><!-- end v-else normal app -->
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted, watch, provide } from 'vue'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

import DashboardView from './views/DashboardView.vue'
import OverlayView from './views/OverlayView.vue'
import GamepadOverlayView from './views/GamepadOverlayView.vue'

const dashboardViewRef = ref(null)

import LogsView from './views/LogsView.vue'
import InfoView from './views/InfoView.vue'
import SettingsView from './views/SettingsView.vue'
import ResolutionTestView from './views/ResolutionTestView.vue'
import ToastNotification from './components/ToastNotification.vue'
import ConfirmDialog from './components/ConfirmDialog.vue'
import DeviceSelector from './components/DeviceSelector.vue'
import { loadTheme, applyTheme } from './utils/themeManager'
import appIcon from './assets/images/ControllerMeta.png'

const toastRef = ref(null)
provide('toast', { show: (msg, type, dur) => toastRef.value?.show(msg, type, dur) })

const confirmDialogRef = ref(null)
provide('confirm', { show: (opts) => confirmDialogRef.value?.show(opts) })

import { MockManager } from './utils/MockManager'
const mockManager = new MockManager()
const mockProfileId = ref('xbox_360')

const version = __APP_VERSION__

// ─── Overlay Mode Detection ───────────────────────────────────────────────────
// When the page is loaded from the OverlayServer (http://localhost:PORT/#overlay)
// rather than from WebView2, switch to a minimal transparent overlay layout.
// 当页面从 OverlayServer (http://localhost:PORT/#overlay) 而非 WebView2 加载时，
// 切换为极简透明覆盖层布局。
const isOverlayMode = !window.chrome?.webview &&
                      window.location.hash.startsWith('#overlay')
// '#gamepad-overlay' 不以 '#overlay' 开头，两个条件互不干扰
const isGamepadOverlayMode = !window.chrome?.webview &&
                              window.location.hash.startsWith('#gamepad-overlay')

// Reactive application state
const state = reactive({
  currentView: 'dashboard', // 'dashboard' | 'logs' | 'info'
  connected: false,
  deviceName: '',
  profileName: 'Xbox 360 Controller', // Default
  pollingRate: 0,
  latency: 0,
  jitter: 0,
  totalSamples: 0,
  buttons: 0,
  triggerL: 0,
  triggerR: 0,
  hidActive: false,
  xinputActive: false,
  dinputActive: false,
  triggerStepL: 0,
  triggerStepR: 0,
  leftStickCurrent: { x: 0, y: 0 },
  rightStickCurrent: { x: 0, y: 0 },
  debugAxes: [],
  logHistory: [],
  maxSamples: 2500, // Default limit
  backendLogs: [],
  isMockMode: false,
  vibrationLeft: 0,
  vibrationRight: 0,
  devices: [],
  selectedDeviceId: ''
})

watch(() => state.maxSamples, (newLimit) => {
  if (state.logHistory.length > newLimit) {
    state.logHistory = state.logHistory.slice(-newLimit)
  }
  // Sync to overlay server so the OBS Browser Source uses the same buffer size.
  // 同步至覆盖层服务器，使 OBS Browser Source 使用相同的缓冲区大小。
  if (window.chrome?.webview) {
    window.chrome.webview.postMessage(JSON.stringify({ type: 'update_overlay_settings', maxPoints: newLimit }))
  }
})

// Variables to track last logged state to avoid flooding
let lastLoggedButtons = -1
let lastLoggedTriggers = { l: -1, r: -1 }
let lastLoggedSticks = { lx: 0, ly: 0, rx: 0, ry: 0 }
let lastLogTime = 0

// Batch point arrays for StickPlot (replaced each frame)
const leftStickBatch = ref([])
const rightStickBatch = ref([])

// ─── High-frequency gamepad data buffer ──────────────────────────────────────
// Decouples WebView2 IPC message rate from Vue reactive update rate.
// The message handler writes here in ~microseconds; the RAF loop applies
// the latest data to Vue state at display rate (≤60fps), so the WebView2
// message queue drains immediately regardless of push frequency.
// 将 WebView2 IPC 消息频率与 Vue 响应式更新频率解耦。
// 消息处理器在微秒级写入；RAF 循环以显示帧率（≤60fps）应用到 Vue 状态，
// 无论推送频率如何，WebView2 消息队列都能立即清空。
let _pendingGamepadData = null  // Latest received payload (overwrites on each message)
let _pendingLeftStick  = []     // Accumulated left stick points from all buffered messages
let _pendingRightStick = []     // Accumulated right stick points from all buffered messages
let _gamepadRafPending = false

function _scheduleGamepadRaf() {
  if (_gamepadRafPending) return
  _gamepadRafPending = true
  requestAnimationFrame(_applyPendingGamepadData)
}

function _applyPendingGamepadData() {
  _gamepadRafPending = false
  const data = _pendingGamepadData
  if (!data) return
  _pendingGamepadData = null
  const leftBatch  = _pendingLeftStick.length  > 0 ? _pendingLeftStick  : null
  const rightBatch = _pendingRightStick.length > 0 ? _pendingRightStick : null
  _pendingLeftStick  = []
  _pendingRightStick = []

  const isFirstArrival = !state.connected
  state.connected  = true
  state.deviceName = data.deviceName || t('status.no_device')

  if ((isOverlayMode || isGamepadOverlayMode) && data.deviceName) {
    if (overlayLastDeviceName && data.deviceName !== overlayLastDeviceName) {
      overlayResetSignal.value++
      state.profileName = data.profileName || data.deviceName || ''
    }
    overlayLastDeviceName = data.deviceName
  }
  state.profileName    = data.profileName || state.profileName
  state.pollingRate    = data.pollingRate  || 0
  state.latency        = data.latency      || 0
  state.jitter         = data.jitter       || 0
  state.buttons        = data.buttons      || 0
  state.triggerL       = data.triggerL     || 0
  state.triggerR       = data.triggerR     || 0
  state.hidActive      = data.hidActive    || false
  state.xinputActive   = data.xinputActive || false
  state.dinputActive   = data.dinputActive || false

  if (data.vibrationLeft  !== undefined) state.vibrationLeft  = data.vibrationLeft
  if (data.vibrationRight !== undefined) state.vibrationRight = data.vibrationRight

  if (leftBatch) {
    leftStickBatch.value = leftBatch
    const last = leftBatch[leftBatch.length - 1]
    state.leftStickCurrent = { x: last.x, y: last.y }
  }
  if (rightBatch) {
    rightStickBatch.value = rightBatch
    const last = rightBatch[rightBatch.length - 1]
    state.rightStickCurrent = { x: last.x, y: last.y }
  }

  // Count all accumulated samples, not just the latest message's
  // 计算所有累积样本数，而不仅仅是最新消息的样本
  state.totalSamples += (leftBatch?.length || 0)

  if (data.debugAxes) state.debugAxes = data.debugAxes

  // ─── Log Capture ───────────────────────────────────────────────────────────
  const buttonsChanged  = state.buttons !== lastLoggedButtons
  const triggersChanged = Math.abs(state.triggerL - lastLoggedTriggers.l) > 2 ||
                          Math.abs(state.triggerR - lastLoggedTriggers.r) > 2
  const sticksChanged   = Math.abs(state.leftStickCurrent.x  - lastLoggedSticks.lx) > 0.05 ||
                          Math.abs(state.leftStickCurrent.y  - lastLoggedSticks.ly) > 0.05 ||
                          Math.abs(state.rightStickCurrent.x - lastLoggedSticks.rx) > 0.05 ||
                          Math.abs(state.rightStickCurrent.y - lastLoggedSticks.ry) > 0.05
  const now = Date.now()
  if (isFirstArrival || buttonsChanged || (now - lastLogTime > 50 && (triggersChanged || sticksChanged))) {
    addLogEntry(state.deviceName, data)
    lastLogTime = now
    if (buttonsChanged)  lastLoggedButtons = state.buttons
    if (triggersChanged) lastLoggedTriggers = { l: state.triggerL, r: state.triggerR }
    if (sticksChanged)   lastLoggedSticks   = {
      lx: state.leftStickCurrent.x, ly: state.leftStickCurrent.y,
      rx: state.rightStickCurrent.x, ry: state.rightStickCurrent.y
    }
  }
}

// Overlay-specific state: synced from main app via SSE events.
// 覆盖层专用状态，通过 SSE 事件从主应用同步。
const overlayMaxPoints   = ref(2500)
const overlayResetSignal = ref(0)
let overlayLastDeviceName = ''

let mockInterval = null

// ─── WebView2 Bridge ─────────────────────────────
function setupWebView2Listener() {
  // Check if running inside WebView2
  if (window.chrome && window.chrome.webview) {
    window.chrome.webview.addEventListener('message', (event) => {
      handleBackendMessage(event.data)
    })
    
    // Send ready signal immediately
    window.chrome.webview.postMessage(JSON.stringify({ type: 'frontend_ready' }))
    
    // Retry once after a delay to be safe (in case backend wasn't fully ready)
    setTimeout(() => {
      if (state.backendLogs.length === 0) {
        window.chrome.webview.postMessage(JSON.stringify({ type: 'frontend_ready' }))
      }
    }, 1000)

    state.connected = true
    state.deviceName = t('status.waiting_device')
  }
}

function handleBackendMessage(data) {
  if (!data) return

  // Theme sync: overlay mode applies data-theme so CSS variables match the main app.
  // 主题同步：覆盖层模式应用 data-theme，使 CSS 变量与主应用匹配。
  if (data.type === 'theme_update') {
    if (data.theme) document.documentElement.setAttribute('data-theme', data.theme)
    return
  }

  // Settings sync: overlay mode uses the same maxPoints as the main app.
  // 设置同步：覆盖层模式使用与主应用相同的 maxPoints。
  if (data.type === 'settings_update') {
    if (isOverlayMode && typeof data.maxPoints === 'number') overlayMaxPoints.value = data.maxPoints
    return
  }

  if (data.type === 'log') {
    state.backendLogs.push({
      id: Math.random().toString(36).substr(2, 9) + Date.now(), // Simple fallback for randomUUID
      timestamp: Date.now(),
      level: data.level || 'info',
      message: data.message
    })
    // Limit to 100 logs
    if (state.backendLogs.length > 100) state.backendLogs.shift()
    return
  }

  if (data.type === 'device_list') {
    state.devices = data.devices || []
    state.selectedDeviceId = data.selectedId || ''
    return
  }

  if (data.type !== 'gamepad_data') return

  if (data.connected === false) {
    // Disconnect: process synchronously — rare event, needs immediate UI feedback.
    // 断开连接：同步处理，罕见事件，需立即更新 UI。
    // Also cancel any pending RAF to avoid applying stale connected data after disconnect.
    _pendingGamepadData = null
    _pendingLeftStick  = []
    _pendingRightStick = []
    if (state.connected) {
      addLogEntry(t('status.disconnected'), data)
    }
    state.connected = false
    state.deviceName = t('status.no_device')
    state.hidActive = false
    state.xinputActive = false
    state.dinputActive = false
    state.pollingRate = 0
    state.latency = 0
    state.jitter = 0
    state.buttons = 0
    state.triggerL = 0
    state.triggerR = 0
    state.debugAxes = []
    leftStickBatch.value = []
    rightStickBatch.value = []
    // Reset trackers
    lastLoggedButtons = -1
    lastLoggedTriggers = { l: -1, r: -1 }
    lastLoggedSticks = { lx: 0, ly: 0, rx: 0, ry: 0 }
    // In overlay mode, clear the trail so stale data from the old device disappears.
    // 覆盖层模式下清空轨迹，避免旧设备数据残留。
    if (isOverlayMode) { overlayResetSignal.value++; overlayLastDeviceName = '' }
    return
  }

  // High-frequency connected path: buffer the latest payload and accumulate stick
  // points. A single requestAnimationFrame will apply everything to Vue state at
  // display rate (≤60fps). This keeps the message handler near-zero cost so the
  // WebView2 IPC queue drains instantly regardless of push frequency.
  // 高频连接路径：缓冲最新载荷并累积摇杆点。requestAnimationFrame 以显示帧率（≤60fps）
  // 将所有数据一次性应用到 Vue 状态。消息处理器几乎零开销，WebView2 IPC 队列立即清空。
  _pendingGamepadData = data
  if (data.leftStick?.length  > 0) _pendingLeftStick.push(...data.leftStick)
  if (data.rightStick?.length > 0) _pendingRightStick.push(...data.rightStick)
  _scheduleGamepadRaf()
}

function addLogEntry(deviceName, data) {
  const entry = {
    id: Math.random().toString(36).substr(2, 9) + Date.now(), // Unique ID for Vue keying
    timestamp: Date.now(),
    deviceName: deviceName,
    buttons: state.buttons,
    lx: state.leftStickCurrent.x,
    ly: state.leftStickCurrent.y,
    rx: state.rightStickCurrent.x,
    ry: state.rightStickCurrent.y,
    lt: state.triggerL,
    rt: state.triggerR
  }
  
  state.logHistory.push(entry)
  
  // Keep last entries based on maxSamples
  if (state.logHistory.length > state.maxSamples) {
    state.logHistory = state.logHistory.slice(-state.maxSamples)
  }
}

// ─── Mock / Demo Mode ────────────────────────────
let mockAngle = 0
let mockT = 0

function startMockMode() {
  if (state.isMockMode) return

  state.isMockMode = true
  mockManager.setActiveDevice(mockProfileId.value)

  // 发布模拟设备列表，使标题栏 DeviceSelector 显示所有可选设备
  handleBackendMessage(mockManager.getDeviceListMessage())

  mockInterval = setInterval(() => {
    const messages = mockManager.generateFrames()
    messages.forEach(msg => handleBackendMessage(msg))
  }, 16)
}

function stopMockMode() {
  if (mockInterval) {
    clearInterval(mockInterval)
    mockInterval = null
  }
  state.isMockMode = false
  state.devices = []
  state.selectedDeviceId = ''
}

function handleMockProfileSelect(profileId) {
  handleSelectDevice(profileId)
}

function handleRumble(data) {
  // Send to C++ backend via WebView2
  if (window.chrome && window.chrome.webview) {
    window.chrome.webview.postMessage(JSON.stringify({
      type: 'rumble',
      left: data.left,
      right: data.right,
    }))
  }
}

function handleSelectDevice(id) {
  if (state.isMockMode) {
    mockManager.setActiveDevice(id)
    state.selectedDeviceId = id
    mockProfileId.value = id
    return
  }
  if (window.chrome && window.chrome.webview) {
    window.chrome.webview.postMessage(JSON.stringify({
      type: 'select_device',
      id: id
    }))
  }
}

function handleToggleLinkage(enabled) {
  if (window.chrome && window.chrome.webview) {
    window.chrome.webview.postMessage(JSON.stringify({
      type: 'trigger_linkage',
      enabled: enabled
    }))
  }
}

function handleStartTest(testId) {
  // In the future, this will coordinate with the C++ backend
  console.log('Starting test:', testId)
}

function handleClearHistory() {
  // Clear logs
  state.logHistory = []
  
  // Clear total samples counter (optional, but requested "clear samples")
  state.totalSamples = 0
  
  // Reset StickPlots
  if (dashboardViewRef.value) {
    dashboardViewRef.value.reset()
  }
}

function openExternalLink(url) {
  if (window.chrome && window.chrome.webview) {
    window.chrome.webview.postMessage(JSON.stringify({
      type: 'open_url',
      url: url
    }))
  } else {
    window.open(url, '_blank')
  }
}

onMounted(() => {
  if (isOverlayMode || isGamepadOverlayMode) {
    // Apply overlay CSS class so body/html are transparent.
    // 应用覆盖层 CSS 类使 body/html 背景透明。
    document.documentElement.classList.add('overlay-mode')
    document.body.classList.add('overlay-mode')
    // Dismiss the loading screen (same mechanism as normal mode).
    // 移除加载动画（与正常模式相同机制）。
    document.body.classList.add('loaded')

    // Connect to the SSE endpoint on the same origin (the OverlayServer).
    // 连接到同源 SSE 端点（OverlayServer）。
    // localStorage key 'cm_sse_url' lets the Vite dev server override the URL for debugging.
    const sseUrl = localStorage.getItem('cm_sse_url') || (window.location.origin + '/events')

    // Fetch initial theme before SSE connects to avoid a flash of the wrong theme.
    // 在 SSE 连接前先获取当前主题，避免短暂显示错误主题。
    fetch(window.location.origin + '/theme')
      .then(r => r.json())
      .then(d => { if (d.theme) document.documentElement.setAttribute('data-theme', d.theme) })
      .catch(() => { /* ignore — SSE theme_update will arrive shortly */ })

    const eventSource = new EventSource(sseUrl)
    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        handleBackendMessage(data)
      } catch (e) { /* ignore malformed frames */ }
    }
    return  // Skip all normal app setup below
  }

  setupWebView2Listener()

  // Initialize base theme (dark/light)
  const savedTheme = localStorage.getItem('user-theme') || 'dark'
  document.documentElement.setAttribute('data-theme', savedTheme)

  // Push current theme and overlay preference to C++ on startup.
  // 启动时将当前主题和覆盖层偏好推送到 C++。
  if (window.chrome?.webview) {
    window.chrome.webview.postMessage(JSON.stringify({ type: 'update_overlay_theme', theme: savedTheme }))
    const overlayEnabled = localStorage.getItem('overlay-enabled') === 'true'
    window.chrome.webview.postMessage(JSON.stringify({ type: 'set_overlay_server', enabled: overlayEnabled }))
    window.chrome.webview.postMessage(JSON.stringify({ type: 'update_overlay_settings', maxPoints: state.maxSamples }))
  }

  // Initialize custom background / glass theme
  loadTheme()

  // Hide the initial loader after a small delay to ensure CSS transitions are smooth
  setTimeout(() => {
    document.body.classList.add('loaded')
  }, 500)
})

onUnmounted(() => {
  if (mockInterval) {
    clearInterval(mockInterval)
    mockInterval = null
  }
})
</script>
