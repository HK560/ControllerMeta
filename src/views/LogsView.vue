<template>
  <div class="h-full max-w-[1600px] mx-auto cs-card flex flex-col overflow-hidden p-0">
    <HistoryLog 
      :history="history" 
      @clear="$emit('clear')" 
      class="h-full"
    />
  </div>
</template>

<script setup>
import HistoryLog from '../components/HistoryLog.vue'

defineProps({
  history: Array
})

defineEmits(['clear'])
</script>
