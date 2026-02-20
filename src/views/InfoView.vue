<template>
  <div class="info-view animate-fade-in max-w-4xl mx-auto space-y-6 p-6">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-black tracking-tight text-(--cs-text-primary)">
        <span class="text-(--cs-accent-blue)">{{ $t('about.title').split(' ')[0] }}</span> {{ $t('about.title').split(' ').slice(1).join(' ') }}
      </h2>
    </div>

    <!-- Project Info Card -->
    <div class="cs-card p-6 rounded-2xl border border-(--cs-border) shadow-sm">
      <div class="flex items-start gap-4">
        <div class="rounded-xl">
          <img :src="appIcon" alt="Logo" class=" w-48 object-contain" />
        </div>
        <div>
          <h3 class="text-lg font-bold text-[var(--cs-text-primary)]">{{ $t('about.title') }} (v{{ version }})</h3>
          <p class="mt-1 text-[10px] text-(--cs-text-secondary) cs-mono opacity-60">{{ $t('about.build_time') }}: {{ buildTime }}</p>
          <p class="mt-1 text-sm text-[var(--cs-text-secondary)] leading-relaxed">
            {{ $t('about.description') }}
          </p>
          <div class="mt-4 flex flex-wrap gap-2">
            <span class="px-2 py-1 text-[10px] uppercase font-bold tracking-wider rounded bg-[var(--cs-bg-primary)] border border-[var(--cs-border)] text-[var(--cs-text-secondary)]">C++20</span>
            <span class="px-2 py-1 text-[10px] uppercase font-bold tracking-wider rounded bg-[var(--cs-bg-primary)] border border-[var(--cs-border)] text-[var(--cs-text-secondary)]">Vue 3</span>
            <span class="px-2 py-1 text-[10px] uppercase font-bold tracking-wider rounded bg-[var(--cs-bg-primary)] border border-[var(--cs-border)] text-[var(--cs-text-secondary)]">WebView2</span>
            <span class="px-2 py-1 text-[10px] uppercase font-bold tracking-wider rounded bg-[var(--cs-bg-primary)] border border-[var(--cs-border)] text-[var(--cs-text-secondary)]">Tailwind CSS</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Author Card -->
    <div class="cs-card p-6 rounded-2xl border border-(--cs-border) shadow-sm relative overflow-hidden group">
      <!-- Background decoration -->
      <div class="absolute top-0 right-0 p-16 bg-[var(--cs-accent-blue)]/5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2 group-hover:bg-[var(--cs-accent-blue)]/10 transition-colors duration-500"></div>

      <div class="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6">
        <!-- Avatar -->
        <div class="relative shrink-0">
          <div class="w-24 h-24 rounded-full p-1 bg-gradient-to-br from-[var(--cs-accent-blue)] to-[var(--cs-accent-purple)]">
             <img 
              :src="avatarUrl" 
              alt="HK560" 
              class="w-full h-full object-cover rounded-full border-2 border-[var(--cs-bg-card)] bg-[var(--cs-bg-primary)]"
              @error="handleImageError"
            />
          </div>
          <!-- Status Indicator -->
          <div class="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-[var(--cs-bg-card)] flex items-center justify-center">
             <div class="w-4 h-4 rounded-full bg-green-500 border-2 border-[var(--cs-bg-card)]"></div>
          </div>
        </div>

        <!-- Info -->
        <div class="text-center md:text-left flex-1">
          <h3 class="text-xl font-bold text-[var(--cs-text-primary)]">HK560</h3>
          <p class="text-sm font-medium text-[var(--cs-accent-blue)] mb-2">{{ $t('about.author') }}
          </p>
          <p class="text-sm text-[var(--cs-text-secondary)] italic mb-4">"Kept you waiting, huh?"</p>
          
          <div class="flex flex-wrap justify-center md:justify-start gap-3">
             <a 
              href="#" 
              @click.prevent="openLink('https://www.elbadaernu.com/')"
              class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--cs-bg-primary)] border border-[var(--cs-border)] hover:border-[var(--cs-accent-blue)] hover:text-[var(--cs-accent-blue)] transition-all group/btn"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{{ $t('about.website') }}</span>
            </a>
            
            <a 
              href="#" 
              @click.prevent="openLink('https://github.com/HK560')"
              class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--cs-bg-primary)] border border-[var(--cs-border)] hover:border-[var(--cs-text-primary)] hover:text-[var(--cs-text-primary)] transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              <span>{{ $t('about.github') }}</span>
            </a>

            <a 
              href="#" 
              @click.prevent="openLink('https://space.bilibili.com/7342356')"
              class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-(--cs-bg-primary) border border-(--cs-border) hover:border-[#FB7299] hover:text-[#FB7299] transition-all"
            >
              <svg class="h-4 w-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                <g> <path fill="none" d="M0 0h24v24H0z"></path> <path d="M18.223 3.086a1.25 1.25 0 0 1 0 1.768L17.08 5.996h1.17A3.75 3.75 0 0 1 22 9.747v7.5a3.75 3.75 0 0 1-3.75 3.75H5.75A3.75 3.75 0 0 1 2 17.247v-7.5a3.75 3.75 0 0 1 3.75-3.75h1.166L5.775 4.855a1.25 1.25 0 1 1 1.767-1.768l2.652 2.652c.079.079.145.165.198.257h3.213c.053-.092.12-.18.199-.258l2.651-2.652a1.25 1.25 0 0 1 1.768 0zm.027 5.42H5.75a1.25 1.25 0 0 0-1.247 1.157l-.003.094v7.5c0 .659.51 1.199 1.157 1.246l.093.004h12.5a1.25 1.25 0 0 0 1.247-1.157l.003-.093v-7.5c0-.69-.56-1.25-1.25-1.25zm-10 2.5c.69 0 1.25.56 1.25 1.25v1.25a1.25 1.25 0 1 1-2.5 0v-1.25c0-.69.56-1.25 1.25-1.25zm7.5 0c.69 0 1.25.56 1.25 1.25v1.25a1.25 1.25 0 1 1-2.5 0v-1.25c0-.69.56-1.25 1.25-1.25z"></path> </g>
              </svg>
              <span>{{ $t('about.bilibili') }}</span>
            </a>

          </div>
        </div>
      </div>
    </div>

    <!-- Backend Diagnostics Card -->
    <div class="cs-card p-6 rounded-2xl border border-(--cs-border) shadow-sm">
      <div class="flex items-center justify-between gap-2 mb-4">
        <div class="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-(--cs-accent-yellow)" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
          <h3 class="text-sm font-bold uppercase tracking-wider text-(--cs-text-primary)">{{ $t('about.diagnostics') }}</h3>
        </div>
        <button
          @click="copyLogs"
          class="flex items-center gap-1 px-2 py-1 text-[10px] rounded bg-(--cs-bg-primary) border border-(--cs-border) text-(--cs-text-secondary) hover:text-(--cs-accent-blue) hover:border-(--cs-accent-blue) transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          {{ copied ? '✓' : 'Copy' }}
        </button>
      </div>

      <div class="bg-[var(--cs-log-bg)] rounded-xl p-4 font-mono text-xs overflow-y-auto max-h-64 space-y-1 shadow-inner border border-[var(--cs-border)]/50">
        <div v-if="logs.length === 0" class="text-(--cs-text-secondary) italic text-center py-4">
          {{ $t('about.no_messages') }}
        </div>
        <div v-for="log in logs" :key="log.id" class="flex gap-2">
          <span class="text-(--cs-text-secondary) opacity-50">{{ formatTime(log.timestamp) }}</span>
          <span :class="levelClass(log.level)">[{{ log.level.toUpperCase() }}]</span>
          <span class="text-(--cs-text-primary)">{{ log.message }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import avatarUrl from '../assets/images/avatar_hk560-modified.png'
import appIcon from '../assets/images/ControllerMeta.png'

const props = defineProps({
  logs: { type: Array, default: () => [] }
})

const version = __APP_VERSION__
const buildTime = __BUILD_TIME__
const copied = ref(false)

function copyLogs() {
  const text = props.logs
    .map(l => `${formatTime(l.timestamp)} [${l.level.toUpperCase()}] ${l.message}`)
    .join('\n')
  navigator.clipboard.writeText(text).then(() => {
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  })
}

function formatTime(ts) {
  const d = new Date(ts)
  return d.toLocaleTimeString('en-GB', { hour12: false })
}

function levelClass(level) {
  switch (level) {
    case 'error': return 'text-[var(--cs-accent-red)] font-bold'
    case 'warn': return 'text-[var(--cs-accent-yellow)] font-bold'
    case 'debug': return 'text-[var(--cs-text-secondary)]'
    default: return 'text-[var(--cs-accent-blue)] font-bold'
  }
}

function openLink(url) {
  // Send to parent/native to open
  if (window.chrome && window.chrome.webview) {
    window.chrome.webview.postMessage(JSON.stringify({
      type: 'open_url',
      url: url
    }))
  } else {
    window.open(url, '_blank')
  }
}
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.4s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
