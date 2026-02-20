<template>
  <Teleport to="body">
    <div class="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 pointer-events-none">
      <TransitionGroup name="toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl border shadow-xl text-sm font-medium backdrop-blur-sm min-w-[200px] max-w-[360px]"
          :class="typeClass(toast.type)"
        >
          <!-- Icon -->
          <span class="shrink-0 text-base leading-none">
            <svg v-if="toast.type === 'success'" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <svg v-else-if="toast.type === 'error'" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            <svg v-else-if="toast.type === 'warn'" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
            <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </span>
          <span class="flex-1 leading-snug">{{ toast.message }}</span>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup>
import { ref } from 'vue'

const toasts = ref([])
let nextId = 0

function typeClass(type) {
  switch (type) {
    case 'success':
      return 'bg-[var(--cs-bg-card)] border-[var(--cs-accent-green)]/40 text-[var(--cs-accent-green)] shadow-[var(--cs-accent-green)]/10'
    case 'error':
      return 'bg-[var(--cs-bg-card)] border-[var(--cs-accent-red)]/40 text-[var(--cs-accent-red)] shadow-[var(--cs-accent-red)]/10'
    case 'warn':
      return 'bg-[var(--cs-bg-card)] border-[var(--cs-accent-orange)]/40 text-[var(--cs-accent-orange)] shadow-[var(--cs-accent-orange)]/10'
    default:
      return 'bg-[var(--cs-bg-card)] border-[var(--cs-accent-blue)]/40 text-[var(--cs-text-primary)] shadow-[var(--cs-accent-blue)]/10'
  }
}

function show(message, type = 'info', duration = 2500) {
  const id = nextId++
  toasts.value.push({ id, message, type })
  setTimeout(() => {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }, duration)
}

defineExpose({ show })
</script>

<style scoped>
.toast-enter-active {
  transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.toast-leave-active {
  transition: all 0.2s ease-in;
}
.toast-enter-from {
  opacity: 0;
  transform: translateY(12px) scale(0.95);
}
.toast-leave-to {
  opacity: 0;
  transform: translateY(6px) scale(0.97);
}
</style>
