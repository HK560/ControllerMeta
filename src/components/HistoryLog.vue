<template>
  <div class="h-full flex flex-col font-mono text-[11px] select-text">
    <!-- Header / Actions -->
    <div class="flex items-center justify-between p-3 border-b border-[var(--cs-border)] bg-[var(--cs-bg-card)] shrink-0">
      <div class="flex items-center gap-4">
        <h2 class="text-xs font-bold uppercase tracking-tight text-[var(--cs-text-primary)]">
          {{ $t('logs.input_event_stream') }}
        </h2>
        <span class="px-1.5 py-0.5 rounded bg-[var(--cs-accent-blue)]/10 text-[var(--cs-accent-blue)] border border-[var(--cs-accent-blue)]/20">
          {{ history.length }} {{ $t('logs.entries') }}
        </span>
        
        <select 
          v-model="displayLimit" 
          class="h-6 text-[10px] bg-(--cs-bg-primary) border border-(--cs-border) rounded px-1 text-(--cs-text-primary) focus:outline-none focus:border-(--cs-accent-blue) cursor-pointer"
        >
          <option :value="100">{{ $t('logs.display_100') }}</option>
          <option :value="200">{{ $t('logs.display_200') }}</option>
          <option :value="500">{{ $t('logs.display_500') }}</option>
          <option :value="2500">{{ $t('logs.display_all') }}</option>
        </select>
      </div>
      <button 
        @click="$emit('clear')" 
        class="px-3 py-1 rounded bg-[var(--cs-accent-red)]/10 text-[var(--cs-accent-red)] border border-[var(--cs-accent-red)]/20 hover:bg-[var(--cs-accent-red)]/20 transition-colors"
      >
        {{ $t('logs.clear_logs') }}
      </button>
    </div>

    <!-- Log Area -->
    <div ref="logContainer" class="flex-1 overflow-y-auto p-4 space-y-1 bg-[var(--cs-log-bg)] shadow-inner">
      <div v-if="history.length === 0" class="h-full flex flex-col items-center justify-center text-[var(--cs-text-secondary)] italic opacity-50">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        {{ $t('logs.no_records') }}
      </div>
      
      <div v-for="(entry, i) in displayedHistory" :key="entry.id" class="grid grid-cols-[100px_1fr] gap-4 py-1.5 border-b border-[var(--cs-border)]/20 last:border-0 hover:bg-[var(--cs-bg-card-hover)] transition-colors group px-2 rounded-md">
        <!-- Timestamp -->
        <div class="text-[var(--cs-text-secondary)] opacity-60">
          {{ formatTime(entry.timestamp) }}
        </div>
        
        <!-- Content -->
        <div class="flex flex-wrap gap-x-4 gap-y-1">
          <!-- Device Name On Change -->
          <div v-if="i === 0 || displayedHistory[i-1].deviceName !== entry.deviceName" class="w-full text-[var(--cs-accent-purple)] font-bold mb-1">
            ▶ {{ $t('status.connected') }}: {{ entry.deviceName }}
          </div>

          <!-- Buttons -->
          <div v-if="entry.buttons !== 0" class="flex gap-1">
            <span class="text-[var(--cs-accent-orange)]">[BTN]</span>
            <span class="text-[var(--cs-text-primary)]">0x{{ entry.buttons.toString(16).toUpperCase().padStart(4, '0') }}</span>
          </div>

          <!-- Sticks -->
          <div class="flex gap-2 text-[var(--cs-text-secondary)]">
            <span>L: <span :class="entry.lx !== 0 || entry.ly !== 0 ? 'text-[var(--cs-accent-green)]' : ''">{{ entry.lx.toFixed(3) }},{{ entry.ly.toFixed(3) }}</span></span>
            <span>R: <span :class="entry.rx !== 0 || entry.ry !== 0 ? 'text-[var(--cs-accent-green)]' : ''">{{ entry.rx.toFixed(3) }},{{ entry.ry.toFixed(3) }}</span></span>
          </div>

          <!-- Triggers -->
          <div class="flex gap-2 text-[var(--cs-text-secondary)]">
            <span>LT: <span :class="entry.lt > 0 ? 'text-[var(--cs-accent-blue)]' : ''">{{ entry.lt }}</span></span>
            <span>RT: <span :class="entry.rt > 0 ? 'text-[var(--cs-accent-blue)]' : ''">{{ entry.rt }}</span></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onUpdated, computed } from 'vue'

const props = defineProps({
  history: { type: Array, default: () => [] }
})

const logContainer = ref(null)
const displayLimit = ref(100)

const displayedHistory = computed(() => {
  return props.history.slice(-displayLimit.value)
})

function formatTime(ts) {
  const d = new Date(ts)
  return d.toLocaleTimeString('en-GB', { hour12: false }) + '.' + d.getMilliseconds().toString().padStart(3, '0')
}

// Auto scroll to bottom
onUpdated(() => {
  if (logContainer.value) {
    logContainer.value.scrollTop = logContainer.value.scrollHeight
  }
})
</script>

<style scoped>
::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-thumb {
  background: var(--cs-border);
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background: var(--cs-accent-blue);
}
</style>
