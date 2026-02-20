<template>
  <div class="flex items-center gap-2 bg-[var(--cs-bg-card)] border border-[var(--cs-border)] rounded-lg px-3 py-1.5 shadow-sm">
    <span class="text-[10px] font-bold text-[var(--cs-text-secondary)] uppercase tracking-wider whitespace-nowrap">
      {{ $t('mock.select_profile') }}:
    </span>
    <select 
      :value="activeProfileId"
      @change="$emit('select', $event.target.value)"
      class="flex-1 bg-[var(--cs-bg-primary)] text-[var(--cs-text-primary)] text-xs border border-[var(--cs-border)] rounded px-2 py-1 outline-none focus:border-[var(--cs-accent-blue)] transition-colors cursor-pointer"
    >
      <option v-for="profile in profiles" :key="profile.id" :value="profile.id">
        {{ profile.deviceName }}
      </option>
    </select>
  </div>
</template>

<script setup>
import { MOCK_PROFILES } from '../utils/MockManager'

defineProps({
  activeProfileId: String
})

defineEmits(['select'])

const profiles = Object.values(MOCK_PROFILES)
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
