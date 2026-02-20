<template>
  <Teleport to="body">
    <Transition name="dialog">
      <div
        v-if="visible"
        class="fixed inset-0 z-[100] flex items-center justify-center"
        tabindex="-1"
        ref="overlayRef"
        @keydown.esc="onCancel"
      >
        <!-- Backdrop: no backdrop-blur here so the panel can blur through to the background -->
        <div class="absolute inset-0 bg-black/50" @click="onCancel" />

        <!-- Panel -->
        <div
          class="cs-dialog-panel relative z-10 w-full max-w-md mx-4 rounded-2xl border shadow-2xl overflow-hidden bg-(--cs-bg-card) border-(--cs-border)"
          :style="panelStyle"
          @click.stop
        >
          <!-- Header -->
          <div class="px-6 pt-6 pb-4 flex items-start gap-4">
            <!-- Icon -->
            <div
              class="shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
              :class="opts.danger ? 'bg-(--cs-accent-red)/15' : 'bg-(--cs-accent-blue)/15'"
            >
              <svg v-if="opts.danger" class="w-5 h-5 text-(--cs-accent-red)" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              </svg>
              <svg v-else class="w-5 h-5 text-(--cs-accent-blue)" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>

            <div class="flex-1 min-w-0">
              <h3 class="text-base font-semibold text-(--cs-text-primary) leading-snug">{{ opts.title }}</h3>
              <p class="mt-1.5 text-sm text-(--cs-text-secondary) leading-relaxed">{{ opts.message }}</p>
            </div>
          </div>

          <!-- Footer -->
          <div class="px-6 pb-6 flex justify-end gap-3">
            <button
              @click="onCancel"
              class="px-4 py-2 text-sm rounded-lg border border-(--cs-border) text-(--cs-text-secondary) hover:bg-(--cs-bg-card-hover) hover:text-(--cs-text-primary) transition-colors"
            >
              {{ opts.cancelText || $t('dialog.cancel') }}
            </button>
            <button
              @click="onConfirm"
              class="px-4 py-2 text-sm rounded-lg font-medium transition-colors"
              :class="opts.danger
                ? 'bg-(--cs-accent-red) text-white hover:opacity-85'
                : 'bg-(--cs-accent-blue) text-white hover:opacity-85'"
            >
              {{ opts.confirmText || $t('dialog.confirm') }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, nextTick, computed } from 'vue'
import { useTheme } from '../utils/themeManager'

const { bgImage, glassEnabled, glassOpacity, glassBlur } = useTheme()

const glassActive = computed(() => glassEnabled.value && !!bgImage.value)

const panelStyle = computed(() => {
  if (!glassActive.value) return {}
  const isLight = document.documentElement.getAttribute('data-theme') === 'light'
  return {
    background: `rgba(var(--cs-card-rgb), ${glassOpacity.value})`,
    backdropFilter: `blur(${glassBlur.value}px) saturate(1.4)`,
    WebkitBackdropFilter: `blur(${glassBlur.value}px) saturate(1.4)`,
    borderColor: isLight ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.12)',
  }
})

const visible = ref(false)
const overlayRef = ref(null)

const opts = ref({
  title: '',
  message: '',
  confirmText: '',
  cancelText: '',
  danger: false,
})

let _resolve = null

function show(options) {
  opts.value = { ...options }
  visible.value = true
  nextTick(() => overlayRef.value?.focus())
  return new Promise((resolve) => {
    _resolve = resolve
  })
}

function onConfirm() {
  visible.value = false
  _resolve?.(true)
  _resolve = null
}

function onCancel() {
  visible.value = false
  _resolve?.(false)
  _resolve = null
}

defineExpose({ show })
</script>

<style scoped>
.dialog-enter-active {
  transition: opacity 0.2s ease;
}
.dialog-leave-active {
  transition: opacity 0.15s ease;
}
.dialog-enter-from,
.dialog-leave-to {
  opacity: 0;
}
.dialog-enter-active .cs-dialog-panel {
  transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.2s ease;
}
.dialog-leave-active .cs-dialog-panel {
  transition: transform 0.15s ease-in, opacity 0.15s ease;
}
.dialog-enter-from .cs-dialog-panel {
  transform: scale(0.93) translateY(-8px);
  opacity: 0;
}
.dialog-leave-to .cs-dialog-panel {
  transform: scale(0.96) translateY(-4px);
  opacity: 0;
}
</style>
