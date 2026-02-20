<template>
  <div class="trigger-bar">
    <div class="flex items-center justify-between mb-1">
      <span class="text-xs font-bold uppercase tracking-wider text-(--cs-text-secondary)">{{ label }}</span>
      <span class="cs-mono text-xs text-(--cs-text-primary)">{{ rawValue }}</span>
    </div>
    <!-- Progress bar -->
    <div class="relative h-6 rounded-md overflow-hidden bg-(--cs-bg-primary) border border-(--cs-border)">
      <div 
        class="absolute inset-y-0 left-0 rounded-md transition-all duration-75"
        :style="{ 
          width: percentage + '%',
          backgroundColor: barColor,
          boxShadow: `0 0 10px ${barColor}44`
        }"
      ></div>
      <div class="absolute inset-0 flex items-center justify-center cs-mono text-[10px] text-white/80">
        {{ percentage.toFixed(1) }}%
      </div>
    </div>
    <!-- Step info -->
    <div class="mt-1 flex justify-between text-[10px] text-(--cs-text-secondary)">
      <span>{{ $t('dashboard.step') || 'Step' }}: <span class="cs-mono text-(--cs-accent-green)">{{ step }}</span></span>
      <span>{{ $t('dashboard.raw') || 'Raw' }}: <span class="cs-mono">{{ rawValue }} / {{ maxValue }}</span></span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  label: { type: String, default: 'Trigger' },
  rawValue: { type: Number, default: 0 },
  maxValue: { type: Number, default: 255 },
  step: { type: Number, default: 0 },
  barColor: { type: String, default: '#4f8cff' },
})

const percentage = computed(() => {
  if (props.maxValue === 0) return 0
  return (props.rawValue / props.maxValue) * 100
})
</script>
