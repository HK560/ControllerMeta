<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  devices: { type: Array, default: () => [] },
  selectedId: { type: String, default: '' }
})

const emit = defineEmits(['select'])

const isOpen = ref(false)
const dropdownRef = ref(null)

const selectedDevice = computed(() =>
  props.devices.find(d => d.id === props.selectedId) || props.devices[0]
)

function select(id) {
  emit('select', id)
  isOpen.value = false
}

function handleClickOutside(e) {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target)) {
    isOpen.value = false
  }
}

onMounted(() => document.addEventListener('mousedown', handleClickOutside))
onUnmounted(() => document.removeEventListener('mousedown', handleClickOutside))
</script>

<template>
  <div ref="dropdownRef" class="relative">
    <!-- Trigger Button -->
    <button
      @click="isOpen = !isOpen"
      class="group flex items-center gap-2 px-2.5 py-1.5 rounded-lg border text-xs transition-all select-none relative"
      :class="isOpen
        ? 'bg-[var(--cs-accent-blue)]/10 border-[var(--cs-accent-blue)]/50 text-[var(--cs-accent-blue)]'
        : 'bg-[var(--cs-bg-primary)] border-[var(--cs-border)] text-[var(--cs-text-primary)] hover:border-[var(--cs-accent-blue)]/50 hover:text-[var(--cs-accent-blue)]'"
    >
      <!-- Gamepad icon -->
      <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 shrink-0 opacity-80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="2" y="6" width="20" height="12" rx="4"/>
        <path d="M6 12h4M8 10v4"/>
        <circle cx="15.5" cy="11.5" r="0.5" fill="currentColor"/>
        <circle cx="17.5" cy="13.5" r="0.5" fill="currentColor"/>
      </svg>

      <!-- Device name -->
      <span class="max-w-[160px] truncate font-medium">
        {{ selectedDevice?.name ?? '...' }}
      </span>

      <!-- Count badge when multiple devices -->
      <span
        v-if="devices.length > 1"
        class="cs-mono text-[10px] px-1.5 py-px rounded-full leading-none"
        :class="isOpen
          ? 'bg-[var(--cs-accent-blue)]/25 text-[var(--cs-accent-blue)]'
          : 'bg-[var(--cs-border)] text-[var(--cs-text-secondary)]'"
      >
        {{ devices.length }}
      </span>

      <!-- Chevron -->
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-3 w-3 shrink-0 opacity-60 transition-transform duration-200"
        :class="isOpen ? 'rotate-180' : ''"
        viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
        stroke-linecap="round" stroke-linejoin="round"
      >
        <polyline points="6 9 12 15 18 9"/>
      </svg>

      <!-- Tooltip: full device name, only when dropdown is closed -->
      <span
        v-if="selectedDevice?.name && !isOpen"
        class="absolute left-1/2 -translate-x-1/2 top-full mt-1.5 px-2 py-1 bg-(--cs-bg-tooltip) text-(--cs-text-tooltip) text-[11px] rounded whitespace-nowrap pointer-events-none z-60 border border-(--cs-border) opacity-0 group-hover:opacity-100 transition-opacity duration-150"
      >
        {{ selectedDevice.name }}
      </span>
    </button>

    <!-- Dropdown Panel -->
    <Transition name="ds-dropdown">
      <div
        v-if="isOpen"
        class="absolute right-0 top-full mt-1.5 min-w-[220px] max-w-[300px] rounded-xl border bg-[var(--cs-bg-card)] border-[var(--cs-border)] shadow-2xl shadow-black/40 z-50 overflow-hidden"
      >
        <!-- Header -->
        <div class="px-3 pt-2.5 pb-1.5 border-b border-[var(--cs-border)]/60">
          <span class="text-[10px] cs-mono uppercase tracking-widest text-[var(--cs-text-secondary)]">
              {{ $t('device_inspector.connected_devices') }}
          </span>
        </div>

        <!-- Device list -->
        <div class="p-1">
          <button
            v-for="dev in devices"
            :key="dev.id"
            @click="select(dev.id)"
            :title="dev.name"
            class="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-all text-left group"
            :class="dev.id === selectedId
              ? 'bg-[var(--cs-accent-blue)]/12 text-[var(--cs-accent-blue)]'
              : 'text-[var(--cs-text-primary)] hover:bg-[var(--cs-bg-card-hover)]'"
          >
            <!-- Check / Dot indicator -->
            <span class="shrink-0 w-3.5 h-3.5 flex items-center justify-center">
              <svg
                v-if="dev.id === selectedId"
                xmlns="http://www.w3.org/2000/svg"
                class="h-3.5 w-3.5"
                viewBox="0 0 24 24" fill="none" stroke="currentColor"
                stroke-width="3" stroke-linecap="round" stroke-linejoin="round"
              >
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              <span
                v-else
                class="w-1.5 h-1.5 rounded-full bg-[var(--cs-border)] group-hover:bg-[var(--cs-accent-blue)]/40 transition-colors"
              ></span>
            </span>

            <!-- Device name -->
            <span class="truncate font-medium">{{ dev.name }}</span>
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.ds-dropdown-enter-active,
.ds-dropdown-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.ds-dropdown-enter-from,
.ds-dropdown-leave-to {
  opacity: 0;
  transform: translateY(-6px) scale(0.97);
}
</style>
