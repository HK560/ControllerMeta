<template>
  <div class="h-full flex flex-col">
    <div class="flex items-center justify-between mb-2 shrink-0">
      <div class="text-[var(--cs-accent-yellow)] font-bold cs-mono text-xs uppercase">
        {{ $t('debug.raw_hid_axes') }}
      </div>
      <div class="text-[10px] text-[var(--cs-text-secondary)]">
        {{ axes.length }} {{ $t('debug.items') }}
      </div>
    </div>
    
    <div class="flex-1 overflow-y-auto bg-[var(--cs-log-bg)] rounded-xl p-3 cs-mono text-[10px] shadow-inner border border-[var(--cs-border)]/50">
      <div v-if="axes.length === 0" class="text-[var(--cs-text-secondary)] italic text-center py-4">
        {{ $t('debug.no_axis_data') }}
      </div>
      <div v-for="(ax, i) in axes" :key="i" class="mb-1 border-b border-[var(--cs-border)]/30 pb-1 last:border-0">
        <div class="flex justify-between text-[var(--cs-text-secondary)]">
          <span>Pg:0x{{ ax.page.toString(16).padStart(2,'0') }}</span>
          <span>Us:0x{{ ax.usage.toString(16).padStart(2,'0') }}</span>
        </div>
        <div class="flex justify-between items-center text-[var(--cs-text-primary)]">
          <span>Raw: {{ ax.raw }}</span>
          <span class="text-[var(--cs-accent-green)] font-bold">{{ ax.norm.toFixed(4) }}</span>
        </div>
        <div class="text-[9px] text-[var(--cs-text-secondary)] opacity-70">
          Range: [{{ ax.min }}..{{ ax.max }}] {{ ax.bits }}bit
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  axes: { type: Array, default: () => [] }
})
</script>
