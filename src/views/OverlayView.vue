<template>
  <!-- 覆盖层视图：圆形摇杆轨迹，背景完全透明，供 OBS Browser Source 采集 -->
  <!-- URL params: #overlay?l → 仅左摇杆, #overlay?r → 仅右摇杆, #overlay → 两个 -->
  <div class="overlay-root" :class="singleMode ? 'single' : 'dual'">
    <StickOverlay
      v-if="showLeft"
      :points="leftStickBatch"
      :maxPoints="maxPoints"
      :resetSignal="resetSignal"
      label="L"
      class="overlay-stick"
    />
    <StickOverlay
      v-if="showRight"
      :points="rightStickBatch"
      :maxPoints="maxPoints"
      :resetSignal="resetSignal"
      label="R"
      class="overlay-stick"
    />
  </div>
</template>

<script setup>
import StickOverlay from '../components/StickOverlay.vue'

defineProps({
  leftStickBatch:  { type: Array,  default: () => [] },
  rightStickBatch: { type: Array,  default: () => [] },
  maxPoints:       { type: Number, default: 2500 },
  resetSignal:     { type: Number, default: 0 }
})

// #overlay?l → 只显示左摇杆
// #overlay?r → 只显示右摇杆
// #overlay   → 显示两个摇杆
const hashQuery = window.location.hash.split('?')[1] || ''
const showLeft  = !hashQuery || hashQuery === 'l'
const showRight = !hashQuery || hashQuery === 'r'
const singleMode = hashQuery === 'l' || hashQuery === 'r'
</script>

<style scoped>
.overlay-root {
  width: 100vw;
  height: 100vh;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  overflow: hidden;
}

.overlay-stick {
  width: min(45vw, 45vh);
}

.single .overlay-stick {
  width: min(80vw, 80vh);
}
</style>
