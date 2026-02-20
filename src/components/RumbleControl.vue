<template>
  <div class="rumble-control">
    <div class="flex items-center justify-between mb-3">
      <h4 class="text-xs font-bold uppercase tracking-wider text-(--cs-text-secondary)">{{ $t('vibration.title') }}</h4>
      <label class="flex items-center gap-2 cursor-pointer select-none group">
        <div class="relative flex items-center">
            <input type="checkbox" v-model="linkageEnabled" @change="toggleLinkage" class="peer sr-only">
            <div class="w-6 h-3 bg-(--cs-bg-primary) border border-(--cs-border) peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-px after:left-px after:bg-(--cs-text-secondary) after:border-gray-300 after:border after:rounded-full after:h-2.5 after:w-2.5 after:transition-all peer-checked:bg-(--cs-accent-blue) peer-checked:after:bg-white peer-checked:border-(--cs-accent-blue)"></div>
        </div>
        <span class="text-[10px] text-(--cs-text-secondary) group-hover:text-(--cs-text-primary) transition-colors">{{ $t('vibration.linkage') }}</span>
      </label>
    </div>
    
    <div class="space-y-3">
      <!-- Left Motor -->
      <div>
        <div class="flex items-center justify-between mb-1">
          <span class="text-[11px] text-(--cs-text-secondary)">{{ $t('vibration.left_motor') }}</span>
          <span class="cs-mono text-[11px] text-(--cs-accent-purple)">{{ leftMotor }}</span>
        </div>
        <input 
          type="range" 
          min="0" 
          max="65535" 
          v-model.number="leftMotor"
          @input="sendRumble"
          :disabled="linkageEnabled"
          class="w-full h-1.5 rounded-lg appearance-none cursor-pointer accent-(--cs-accent-purple) disabled:opacity-50 disabled:cursor-not-allowed"
          style="background: linear-gradient(90deg, var(--cs-border), var(--cs-accent-purple));"
        />
      </div>

      <!-- Right Motor -->
      <div>
        <div class="flex items-center justify-between mb-1">
          <span class="text-[11px] text-(--cs-text-secondary)">{{ $t('vibration.right_motor') }}</span>
          <span class="cs-mono text-[11px] text-(--cs-accent-orange)">{{ rightMotor }}</span>
        </div>
        <input 
          type="range" 
          min="0" 
          max="65535" 
          v-model.number="rightMotor"
          @input="sendRumble"
          :disabled="linkageEnabled"
          class="w-full h-1.5 rounded-lg appearance-none cursor-pointer accent-(--cs-accent-orange) disabled:opacity-50 disabled:cursor-not-allowed"
          style="background: linear-gradient(90deg, var(--cs-border), var(--cs-accent-orange));"
        />
      </div>

      <!-- Quick actions -->
      <div class="flex gap-2 pt-1">
        <button 
          @click="stopRumble"
          :disabled="linkageEnabled"
          class="flex-1 px-2 py-1 text-[10px] rounded bg-(--cs-bg-primary) text-(--cs-text-secondary) hover:text-(--cs-accent-red) border border-(--cs-border) transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ $t('vibration.stop_all') }}
        </button>
        <button 
          @click="testRumble"
          :disabled="linkageEnabled"
          class="flex-1 px-2 py-1 text-[10px] rounded bg-(--cs-bg-primary) text-(--cs-text-secondary) hover:text-(--cs-accent-green) border border-(--cs-border) transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ $t('vibration.test_pulse') }}
        </button>
      </div>

      <!-- Advanced Tests (Row 2) -->
      <div class="flex gap-2">
        <button 
          @click="runBrakeTest"
          :disabled="linkageEnabled"
          class="flex-1 px-2 py-1 text-[10px] rounded bg-(--cs-bg-primary) text-(--cs-text-secondary) hover:text-(--cs-accent-orange) border border-(--cs-border) transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ $t('vibration.brake_test') }}
        </button>
        <button 
          @click="runGameSim"
          :disabled="linkageEnabled"
          class="flex-1 px-2 py-1 text-[10px] rounded bg-(--cs-bg-primary) text-(--cs-text-secondary) hover:text-(--cs-accent-blue) border border-(--cs-border) transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ $t('vibration.game_immersion') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  currentLeft: { type: Number, default: 0 },
  currentRight: { type: Number, default: 0 }
})

const emit = defineEmits(['rumble', 'toggleLinkage'])

const leftMotor = ref(0)
const rightMotor = ref(0)
const linkageEnabled = ref(false)

let animFrameId = null
let timeoutId = null

function clearSim() {
  if (animFrameId) cancelAnimationFrame(animFrameId)
  if (timeoutId) clearTimeout(timeoutId)
  animFrameId = null
  timeoutId = null
}

watch(() => [props.currentLeft, props.currentRight], ([l, r]) => {
  if (linkageEnabled.value) {
    leftMotor.value = l
    rightMotor.value = r
  }
})

function toggleLinkage() {
  emit('toggleLinkage', linkageEnabled.value)
  // If disabling, the backend handles stopping, but we might want to reset local sliders?
  // Let's keep them as is or reset.
}

function sendRumble() {
  emit('rumble', { left: leftMotor.value, right: rightMotor.value })
}

function stopRumble() {
  if (linkageEnabled.value) return
  clearSim()
  leftMotor.value = 0
  rightMotor.value = 0
  sendRumble()
}

// ```javascript
/**
 * 计划：
 * 1. 将震动周期从 1000ms 缩短至 150ms，显著提高震动频率。
 * 2. 调整脉冲宽度（ON 时间）为 60ms，确保高频下的打击感。
 * 3. 稍微提高电机数值以增强震动反馈。
 */
function testRumble() {
  clearSim()
  const startTime = performance.now()
  const duration = 5000 // 持续 5 秒

  const animate = (time) => {
    const elapsed = time - startTime
    
    if (elapsed >= duration) {
      stopRumble()
      return
    }

    // 提高频率：将周期从 1000ms 缩减到 150ms
    const cycle = elapsed % 150
    
    if (cycle < 100) {
      // 短促有力的高频脉冲
      leftMotor.value = 55000
      rightMotor.value = 55000
    } else {
      leftMotor.value = 0
      rightMotor.value = 0
    }
    
    sendRumble()
    animFrameId = requestAnimationFrame(animate)
  }
  
  animFrameId = requestAnimationFrame(animate)
}

function runBrakeTest() {
  clearSim()
  // Full blast
  leftMotor.value = 65535
  rightMotor.value = 65535
  sendRumble()
  
  // Hard stop after 500ms
  timeoutId = setTimeout(() => {
    leftMotor.value = 0
    rightMotor.value = 0
    sendRumble()
  }, 200)
}

function runGameSim() {
  clearSim()
  const startTime = performance.now()
  
  const animate = (time) => {
    const elapsed = time - startTime
    
    if (elapsed < 1000) {
      // Idle engine (low freq right motor)
      leftMotor.value = 0
      rightMotor.value = 8000 + (Math.random() * 2000) // slight variations
    } else if (elapsed < 2500) {
      // Acceleration (Ramp up right motor)
      const p = (elapsed - 1000) / 1500
      leftMotor.value = p * 10000 // minimal road noise
      rightMotor.value = 10000 + p * 40000
    } else if (elapsed < 2600) {
      // Gear Shift (Pause)
      leftMotor.value = 0
      rightMotor.value = 0
    } else if (elapsed < 2800) {
      // Torque Kick (Left motor heavy)
      leftMotor.value = 45000
      rightMotor.value = 45000
    } else if (elapsed < 4000) {
      // High Speed (Both motors high freq hum)
      // Use time to create a waive
      leftMotor.value = 15000 + Math.sin(time / 50) * 5000
      rightMotor.value = 40000 + Math.cos(time / 50) * 5000
    } else if (elapsed < 4200) {
      // Crash / Brake (Max)
      leftMotor.value = 65535
      rightMotor.value = 65535
    } else if (elapsed < 5000) {
      // Fade out
      const p = 1.0 - ((elapsed - 4200) / 800)
      leftMotor.value = p * 65535
      rightMotor.value = p * 65535
    } else {
      // End
      stopRumble()
      return
    }
    
    sendRumble()
    animFrameId = requestAnimationFrame(animate)
  }
  
  animFrameId = requestAnimationFrame(animate)
}
</script>
