<template>
  <!-- OBS 覆盖层：完整手柄布局，背景透明，自动检测手柄类型 -->
  <div class="gamepad-overlay-root">
    <GamepadVisualizer
      :hideStatusBar="true"
      :buttons="buttons"
      :leftStickX="leftStickX"
      :leftStickY="leftStickY"
      :rightStickX="rightStickX"
      :rightStickY="rightStickY"
      :profileName="profileName"
      :triggerL="triggerL"
      :triggerR="triggerR"
    />
  </div>
</template>

<script setup>
import GamepadVisualizer from '../components/GamepadVisualizer.vue'

defineProps({
  buttons:     { type: Number, default: 0 },
  leftStickX:  { type: Number, default: 0 },
  leftStickY:  { type: Number, default: 0 },
  rightStickX: { type: Number, default: 0 },
  rightStickY: { type: Number, default: 0 },
  profileName: { type: String, default: '' },
  triggerL:    { type: Number, default: 0 },
  triggerR:    { type: Number, default: 0 },
})
</script>

<style scoped>
.gamepad-overlay-root {
  width: 100vw;
  height: 100vh;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 去除内边距，让 SVG 撑满容器 */
.gamepad-overlay-root :deep(.gamepad-viz) {
  padding: 0;
  width: 100%;
  height: 100%;
}

/* SVG 按比例填满视口（等效 object-fit: contain） */
.gamepad-overlay-root :deep(.gamepad-viz > svg) {
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
}
</style>
