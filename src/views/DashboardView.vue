<template>
  <div class="grid grid-cols-2 lg:grid-cols-12 auto-rows-auto gap-3 max-w-[1600px] mx-auto min-w-[800px]">
    
    <!-- Row 1: Stick Plots + Stats -->
    <div class="col-span-1 lg:col-span-3 cs-card min-h-[220px]">
      <StickPlot ref="leftStickRef" :label="$t('stick.left_label')" :points="leftStickBatch" :maxPoints="state.maxSamples" :isActive="isActive" />
    </div>
    <div class="col-span-1 lg:col-span-3 cs-card min-h-[220px]">
      <StickPlot ref="rightStickRef" :label="$t('stick.right_label')" :points="rightStickBatch" :maxPoints="state.maxSamples" :isActive="isActive" />
    </div>
    <div class="col-span-2 lg:col-span-3 cs-card min-h-[220px]">
      <Dashboard
        :connected="state.connected"
        :deviceName="state.deviceName"
        :pollingRate="state.pollingRate"
        :latency="state.latency"
        :jitter="state.jitter"
        :totalSamples="state.totalSamples"
        :limit="state.maxSamples"
        @update:limit="state.maxSamples = $event"
        @clearHistory="$emit('clearHistory')"
      />
    </div>
    
    <!-- Test Suite (Row 1 Col 4) -->
    <div class="col-span-2 lg:col-span-3 cs-card min-h-[220px] flex flex-col">
      <div v-if="state.isMockMode" class="mb-3">
        <MockMenu :activeProfileId="mockProfileId" @select="$emit('mockProfileSelect', $event)" />
      </div>
      <!-- <TestSuite @startTest="$emit('startTest', $event)" class="flex-1 overflow-y-auto" /> -->
       <DeviceInspector class="flex-1 min-h-0" />
    </div>

    <!-- Row 2: Visualizer + Triggers + Debug -->
    <div class="col-span-2 lg:col-span-4 cs-card flex items-center justify-center min-h-[160px]">
      <GamepadVisualizer
        :buttons="state.buttons"
        :leftStickX="state.leftStickCurrent.x"
        :leftStickY="state.leftStickCurrent.y"
        :rightStickX="state.rightStickCurrent.x"
        :rightStickY="state.rightStickCurrent.y"
        :profileName="state.profileName"
        :triggerL="state.triggerL"
        :triggerR="state.triggerR"
      />
    </div>
    <div class="col-span-2 lg:col-span-4 cs-card space-y-4 min-h-[160px]">
      <div class="grid grid-cols-2 gap-3">
        <TriggerBar label="LT" :rawValue="state.triggerL" :maxValue="255" :step="state.triggerStepL" barColor="var(--cs-accent-blue)" />
        <TriggerBar label="RT" :rawValue="state.triggerR" :maxValue="255" :step="state.triggerStepR" barColor="var(--cs-accent-red)" />
      </div>
      <RumbleControl 
        :currentLeft="state.vibrationLeft" 
        :currentRight="state.vibrationRight" 
        @rumble="$emit('rumble', $event)" 
        @toggleLinkage="$emit('toggleLinkage', $event)" 
      />
    </div>
    
    <!-- Mini Debug Log (Row 2 Col 3 - Bottom Right) -->
    <div class="col-span-2 lg:col-span-4 cs-card min-h-[160px] flex flex-col overflow-hidden">
       <DebugLog :axes="state.debugAxes" class="h-full" />
    </div>

  </div>
</template>

<script setup>
import StickPlot from '../components/StickPlot.vue'
import TriggerBar from '../components/TriggerBar.vue'
import RumbleControl from '../components/RumbleControl.vue'
import Dashboard from '../components/Dashboard.vue'
import GamepadVisualizer from '../components/GamepadVisualizer.vue'
// import TestSuite from '../components/TestSuite.vue'
import DeviceInspector from '../components/DeviceInspector.vue'
import DebugLog from '../components/DebugLog.vue'
import MockMenu from '../components/MockMenu.vue'
import { ref } from 'vue'

defineProps({
  state: Object,
  leftStickBatch: Array,
  rightStickBatch: Array,
  mockProfileId: String,
  isActive: { type: Boolean, default: true }
})

const emit = defineEmits(['startTest', 'rumble', 'toggleLinkage', 'clearHistory', 'mockProfileSelect'])

const leftStickRef = ref(null)
const rightStickRef = ref(null)

function resetVisualizers() {
  if (leftStickRef.value) leftStickRef.value.reset()
  if (rightStickRef.value) rightStickRef.value.reset()
}

defineExpose({
  reset: resetVisualizers
})
</script>
