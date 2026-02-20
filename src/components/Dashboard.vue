<template>
  <div class="dashboard">
    <h4 class="text-xs font-bold uppercase tracking-wider text-[var(--cs-text-secondary)] mb-3">
      <span class="inline-block w-2 h-2 rounded-full mr-1.5 animate-pulse"
        :class="connected ? 'bg-[var(--cs-accent-green)]' : 'bg-[var(--cs-accent-red)]'"
      ></span>
      {{ $t('dashboard.device_info') }}
    </h4>

    <div class="space-y-2">
      <!-- Device Name -->
      <div class="p-2 rounded-lg bg-[var(--cs-bg-primary)]">
        <div class="text-[10px] text-[var(--cs-text-secondary)] uppercase">{{ $t('dashboard.device') }}</div>
        <div class="text-sm font-semibold truncate">{{ deviceName || $t('status.no_device') }}</div>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-2 gap-2">
        <div class="p-2 rounded-lg bg-[var(--cs-bg-primary)]">
          <div class="text-[10px] text-[var(--cs-text-secondary)] uppercase">{{ $t('dashboard.polling_rate') }}</div>
          <div class="cs-mono text-lg font-bold text-[var(--cs-accent-blue)]">
            {{ pollingRate.toFixed(1) }}
            <span class="text-[10px] text-[var(--cs-text-secondary)]">Hz</span>
          </div>
        </div>
        <div class="p-2 rounded-lg bg-[var(--cs-bg-primary)]">
          <div class="text-[10px] text-[var(--cs-text-secondary)] uppercase">{{ $t('dashboard.latency') }}</div>
          <div class="cs-mono text-lg font-bold text-[var(--cs-accent-green)]">
            {{ latency.toFixed(2) }}
            <span class="text-[10px] text-[var(--cs-text-secondary)]">ms</span>
          </div>
        </div>
        <div class="p-2 rounded-lg bg-[var(--cs-bg-primary)]">
          <div class="text-[10px] text-[var(--cs-text-secondary)] uppercase">{{ $t('dashboard.jitter') }}</div>
          <div class="cs-mono text-lg font-bold text-[var(--cs-accent-orange)]">
            {{ jitter.toFixed(3) }}
            <span class="text-[10px] text-[var(--cs-text-secondary)]">ms</span>
          </div>
        </div>
        <div class="p-2 rounded-lg bg-[var(--cs-bg-primary)]">
          <div class="text-[10px] text-[var(--cs-text-secondary)] uppercase">{{ $t('dashboard.samples') }}</div>
          <div class="cs-mono text-lg font-bold text-[var(--cs-accent-purple)]">
            {{ totalSamples }}
          </div>
        </div>
      </div>

      <!-- Sampling Limit Selector -->
      <div class="p-2 rounded-lg bg-[var(--cs-bg-primary)] border border-[var(--cs-border)]">
        <div class="flex items-center justify-between mb-2">
          <div class="text-[10px] text-[var(--cs-text-secondary)] uppercase">{{ $t('dashboard.sampling_limit') }}</div>
          <span class="text-[10px] text-[var(--cs-accent-blue)] font-bold">{{ limit }} pts</span>
        </div>
        <div class="flex gap-1">
          <button 
            v-for="val in [1000, 2500, 5000, 10000]" 
            :key="val"
            @click="$emit('update:limit', val)"
            class="flex-1 py-1 text-[10px] rounded border transition-colors"
            :class="limit === val ? 'bg-[var(--cs-accent-blue)] text-white border-[var(--cs-accent-blue)]' : 'bg-[var(--cs-bg-card)] text-[var(--cs-text-secondary)] border-[var(--cs-border)] hover:border-[var(--cs-text-secondary)]'"
          >
            {{ val }}
          </button>
        </div>
      </div>

      <!-- Clear Button -->
      <button 
        @click="$emit('clearHistory')"
        class="w-full py-1.5 rounded-lg bg-[var(--cs-accent-red)]/10 text-[var(--cs-accent-red)] border border-[var(--cs-accent-red)]/20 hover:bg-[var(--cs-accent-red)]/20 transition-colors text-xs font-semibold uppercase tracking-wide"
      >
        {{ $t('dashboard.clear_history') }}
      </button>

    </div>
  </div>
</template>

<script setup>
defineProps({
  connected: { type: Boolean, default: false },
  deviceName: { type: String, default: '' },
  pollingRate: { type: Number, default: 0 },
  latency: { type: Number, default: 0 },
  jitter: { type: Number, default: 0 },
  totalSamples: { type: Number, default: 0 },
  limit: { type: Number, default: 2500 }
})
defineEmits(['update:limit', 'clearHistory'])
</script>
