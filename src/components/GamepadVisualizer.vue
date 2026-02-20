<template>
  <div class="gamepad-viz relative select-none w-full flex justify-center items-center py-6">
    <!-- Visualizer Container -->
    <svg viewBox="0 0 400 240" class="w-full max-w-[480px] drop-shadow-2xl transition-all duration-500" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="glow" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        <radialGradient id="buttonOverlay" cx="50%" cy="50%" r="50%">
          <stop offset="0%" style="stop-color:white;stop-opacity:0.1" />
          <stop offset="100%" style="stop-color:black;stop-opacity:0.05" />
        </radialGradient>
        <!-- Clip path matches trigger shape: 60×22, rx=5, centered at origin -->
        <clipPath id="viz-trigger-clip">
          <rect x="-30" y="-11" width="60" height="22" rx="5" />
        </clipPath>
      </defs>

      <!-- Minimalist Floating Layout (Centered at 200) -->
      <g class="transition-all duration-300">
        <!-- Xbox / Switch Layout Elements -->
        <template v-if="visualType !== 'ps'">
          <!-- Left Side: Stick (100) & Dpad (140) -->
          <g transform="translate(100, 85)">
            <circle r="30" fill="var(--cs-viz-glass)" stroke="var(--cs-viz-stroke)" stroke-width="1.5" />
            <circle :cx="leftStickX * 16" :cy="leftStickY * -16" r="20" :fill="isPressed('l3') ? 'var(--cs-accent-blue)' : 'var(--cs-viz-bg)'" :stroke="isPressed('l3') ? 'var(--cs-accent-blue)' : 'var(--cs-viz-stroke-focus)'" stroke-width="3" :filter="isPressed('l3') ? 'url(#glow)' : ''"/>
            <circle :cx="leftStickX * 16" :cy="leftStickY * -16" r="20" fill="url(#buttonOverlay)" />
          </g>

          <g transform="translate(140, 155)">
            <circle r="30" fill="var(--cs-viz-glass)" stroke="var(--cs-viz-stroke)" stroke-width="1" stroke-dasharray="3,3" opacity="0.5" />
            <rect x="-8" y="-25" width="16" height="15" rx="3" :fill="isPressed('up') ? 'var(--cs-accent-blue)' : 'var(--cs-viz-bg)'" :stroke="isPressed('up') ? 'var(--cs-accent-blue)' : 'var(--cs-viz-stroke)'" stroke-width="2" />
            <rect x="-8" y="10" width="16" height="15" rx="3" :fill="isPressed('down') ? 'var(--cs-accent-blue)' : 'var(--cs-viz-bg)'" :stroke="isPressed('down') ? 'var(--cs-accent-blue)' : 'var(--cs-viz-stroke)'" stroke-width="2" />
            <rect x="-25" y="-8" width="15" height="16" rx="3" :fill="isPressed('left') ? 'var(--cs-accent-blue)' : 'var(--cs-viz-bg)'" :stroke="isPressed('left') ? 'var(--cs-accent-blue)' : 'var(--cs-viz-stroke)'" stroke-width="2" />
            <rect x="10" y="-8" width="15" height="16" rx="3" :fill="isPressed('right') ? 'var(--cs-accent-blue)' : 'var(--cs-viz-bg)'" :stroke="isPressed('right') ? 'var(--cs-accent-blue)' : 'var(--cs-viz-stroke)'" stroke-width="2" />
          </g>

          <!-- Right Side: Buttons (300) & Stick (260) -->
          <g transform="translate(300, 85)">
            <circle r="38" fill="var(--cs-viz-glass)" stroke="var(--cs-viz-stroke)" stroke-width="1.5" stroke-dasharray="4,4" opacity="0.3" />
            <g v-for="btn in faceButtons" :key="btn.key" :transform="`translate(${btn.x}, ${btn.y}) ${isPressed(btn.key) ? 'scale(0.92)' : ''}`" class="transition-all duration-75">
              <circle r="12" :fill="isPressed(btn.key) ? btn.color : 'var(--cs-viz-bg)'" :stroke="isPressed(btn.key) ? btn.color : 'var(--cs-viz-stroke)'" stroke-width="2.5" :filter="isPressed(btn.key) ? 'url(#glow)' : ''" />
              <circle r="12" fill="url(#buttonOverlay)" />
              <text y="4" text-anchor="middle" :fill="isPressed(btn.key) ? 'white' : 'var(--cs-viz-text)'" font-size="11" font-weight="900" class="uppercase">{{ btn.label }}</text>
            </g>
          </g>

          <g transform="translate(260, 155)">
            <circle r="30" fill="var(--cs-viz-glass)" stroke="var(--cs-viz-stroke)" stroke-width="1.5" />
            <circle :cx="rightStickX * 16" :cy="rightStickY * -16" r="20" :fill="isPressed('r3') ? 'var(--cs-accent-blue)' : 'var(--cs-viz-bg)'" :stroke="isPressed('r3') ? 'var(--cs-accent-blue)' : 'var(--cs-viz-stroke-focus)'" stroke-width="3" :filter="isPressed('r3') ? 'url(#glow)' : ''"/>
            <circle :cx="rightStickX * 16" :cy="rightStickY * -16" r="20" fill="url(#buttonOverlay)" />
          </g>

          <!-- LT/ZL Trigger — 60×22 pill, fills bottom-up -->
          <g transform="translate(100, 16)">
            <rect x="-30" y="-11" width="60" height="22" rx="5"
              fill="var(--cs-viz-bg)"
              :stroke="triggerL > 0 ? 'var(--cs-accent-blue)' : 'var(--cs-viz-stroke)'"
              stroke-width="1.5" />
            <rect x="-30" :y="11 - triggerLH" width="60" :height="triggerLH"
              fill="var(--cs-accent-blue)" clip-path="url(#viz-trigger-clip)" opacity="0.85" />
            <text x="0" y="0" text-anchor="middle" dominant-baseline="middle"
              :fill="triggerL > 0 ? 'white' : 'var(--cs-viz-text)'"
              font-size="7" font-weight="bold" :opacity="triggerL > 0 ? 0.9 : 0.55">{{ triggerLabels.l }}</text>
          </g>
          <!-- RT/ZR Trigger -->
          <g transform="translate(300, 16)">
            <rect x="-30" y="-11" width="60" height="22" rx="5"
              fill="var(--cs-viz-bg)"
              :stroke="triggerR > 0 ? 'var(--cs-accent-blue)' : 'var(--cs-viz-stroke)'"
              stroke-width="1.5" />
            <rect x="-30" :y="11 - triggerRH" width="60" :height="triggerRH"
              fill="var(--cs-accent-blue)" clip-path="url(#viz-trigger-clip)" opacity="0.85" />
            <text x="0" y="0" text-anchor="middle" dominant-baseline="middle"
              :fill="triggerR > 0 ? 'white' : 'var(--cs-viz-text)'"
              font-size="7" font-weight="bold" :opacity="triggerR > 0 ? 0.9 : 0.55">{{ triggerLabels.r }}</text>
          </g>

          <!-- LB Bumper — wide pill, fully rounded ends -->
          <g class="transition-all duration-150" :transform="`translate(100, 38) ${isPressed('lb') ? 'translate(0, 2)' : ''}`">
            <rect x="-30" y="-6" width="60" height="13" rx="6.5"
              :fill="isPressed('lb') ? 'var(--cs-accent-blue)' : 'var(--cs-viz-bg)'"
              :stroke="isPressed('lb') ? 'var(--cs-accent-blue)' : 'var(--cs-viz-stroke)'"
              stroke-width="1.5" :filter="isPressed('lb') ? 'url(#glow)' : ''" />
            <text x="0" y="0.5" text-anchor="middle" dominant-baseline="middle"
              :fill="isPressed('lb') ? 'white' : 'var(--cs-viz-text)'"
              font-size="8" font-weight="bold" :opacity="isPressed('lb') ? 0.9 : 0.6">LB</text>
          </g>
          <!-- RB Bumper -->
          <g class="transition-all duration-150" :transform="`translate(300, 38) ${isPressed('rb') ? 'translate(0, 2)' : ''}`">
            <rect x="-30" y="-6" width="60" height="13" rx="6.5"
              :fill="isPressed('rb') ? 'var(--cs-accent-blue)' : 'var(--cs-viz-bg)'"
              :stroke="isPressed('rb') ? 'var(--cs-accent-blue)' : 'var(--cs-viz-stroke)'"
              stroke-width="1.5" :filter="isPressed('rb') ? 'url(#glow)' : ''" />
            <text x="0" y="0.5" text-anchor="middle" dominant-baseline="middle"
              :fill="isPressed('rb') ? 'white' : 'var(--cs-viz-text)'"
              font-size="8" font-weight="bold" :opacity="isPressed('rb') ? 0.9 : 0.6">RB</text>
          </g>

          <!-- Mid Buttons (Centered at 200) -->
          <g transform="translate(200, 80)">
            <circle cx="-25" cy="5" r="7" :fill="isPressed('back') ? 'var(--cs-accent-blue)' : 'var(--cs-viz-bg)'" stroke="var(--cs-viz-stroke)" stroke-width="1.8" />
            <circle cx="25" cy="5" r="7" :fill="isPressed('start') ? 'var(--cs-accent-blue)' : 'var(--cs-viz-bg)'" stroke="var(--cs-viz-stroke)" stroke-width="1.8" />
            <circle cx="0" cy="-15" r="14" :fill="isPressed('guide') ? 'var(--cs-text-primary)' : 'var(--cs-viz-bg)'" stroke="var(--cs-viz-stroke)" stroke-width="2.5" />
          </g>
        </template>

        <!-- PlayStation Layout Elements (Centered at 200) -->
        <template v-else>
          <!-- Left: Dpad (100) and Stick (150) -->
          <g transform="translate(100, 95)">
            <rect x="-8" y="-26" width="16" height="18" rx="2" :fill="isPressed('up') ? 'var(--cs-accent-blue)' : 'var(--cs-viz-bg)'" stroke="var(--cs-viz-stroke)" stroke-width="2"/>
            <rect x="-8" y="8" width="16" height="18" rx="2" :fill="isPressed('down') ? 'var(--cs-accent-blue)' : 'var(--cs-viz-bg)'" stroke="var(--cs-viz-stroke)" stroke-width="2"/>
            <rect x="-26" y="-8" width="18" height="16" rx="2" :fill="isPressed('left') ? 'var(--cs-accent-blue)' : 'var(--cs-viz-bg)'" stroke="var(--cs-viz-stroke)" stroke-width="2"/>
            <rect x="8" y="-8" width="18" height="16" rx="2" :fill="isPressed('right') ? 'var(--cs-accent-blue)' : 'var(--cs-viz-bg)'" stroke="var(--cs-viz-stroke)" stroke-width="2"/>
          </g>
          <g transform="translate(150, 155)">
            <circle r="30" fill="var(--cs-viz-glass)" stroke="var(--cs-viz-stroke)" stroke-width="1.5" />
            <circle :cx="leftStickX * 16" :cy="leftStickY * -16" r="20" :fill="isPressed('l3') ? 'var(--cs-accent-blue)' : 'var(--cs-viz-bg)'" :stroke="isPressed('l3') ? 'var(--cs-accent-blue)' : 'var(--cs-viz-stroke-focus)'" stroke-width="3" />
          </g>

          <!-- Right: Buttons (300) and Stick (250) -->
          <g transform="translate(300, 95)">
            <circle r="38" fill="var(--cs-viz-glass)" stroke="var(--cs-viz-stroke)" stroke-width="1.5" stroke-dasharray="4,4" opacity="0.3" />
            <g :transform="isPressed('y') ? 'scale(0.9) translate(0, -22)' : 'translate(0, -22)'" class="transition-all duration-100"><circle r="12" :fill="isPressed('y') ? 'var(--cs-accent-green)' : 'var(--cs-viz-bg)'" :stroke="isPressed('y') ? 'var(--cs-accent-green)' : 'var(--cs-viz-stroke)'" stroke-width="2.5" :filter="isPressed('y') ? 'url(#glow)' : ''"/><path d="M0,-5 L-5,4 L5,4 Z" fill="none" :stroke="isPressed('y') ? 'white' : 'var(--cs-viz-text)'" stroke-width="1.5" /></g>
            <g :transform="isPressed('b') ? 'scale(0.9) translate(22, 0)' : 'translate(22, 0)'" class="transition-all duration-100"><circle r="12" :fill="isPressed('b') ? 'var(--cs-accent-red)' : 'var(--cs-viz-bg)'" :stroke="isPressed('b') ? 'var(--cs-accent-red)' : 'var(--cs-viz-stroke)'" stroke-width="2.5" :filter="isPressed('b') ? 'url(#glow)' : ''"/><circle r="5" fill="none" :stroke="isPressed('b') ? 'white' : 'var(--cs-viz-text)'" stroke-width="1.5" /></g>
            <g :transform="isPressed('a') ? 'scale(0.9) translate(0, 22)' : 'translate(0, 22)'" class="transition-all duration-100"><circle r="12" :fill="isPressed('a') ? 'var(--cs-accent-blue)' : 'var(--cs-viz-bg)'" :stroke="isPressed('a') ? 'var(--cs-accent-blue)' : 'var(--cs-viz-stroke)'" stroke-width="2.5" :filter="isPressed('a') ? 'url(#glow)' : ''"/><path d="M-4,-4 L4,4 M4,-4 L-4,4" fill="none" :stroke="isPressed('a') ? 'white' : 'var(--cs-viz-text)'" stroke-width="2.5" /></g>
            <g :transform="isPressed('x') ? 'scale(0.9) translate(-22, 0)' : 'translate(-22, 0)'" class="transition-all duration-100"><circle r="12" :fill="isPressed('x') ? 'var(--cs-accent-purple)' : 'var(--cs-viz-bg)'" :stroke="isPressed('x') ? 'var(--cs-accent-purple)' : 'var(--cs-viz-stroke)'" stroke-width="2.5" :filter="isPressed('x') ? 'url(#glow)' : ''"/><rect x="-4.5" y="-4.5" width="9" height="9" rx="1" fill="none" :stroke="isPressed('x') ? 'white' : 'var(--cs-viz-text)'" stroke-width="1.5" /></g>
          </g>
          <g transform="translate(250, 155)">
            <circle r="30" fill="var(--cs-viz-glass)" stroke="var(--cs-viz-stroke)" stroke-width="1.5" />
            <circle :cx="rightStickX * 16" :cy="rightStickY * -16" r="20" :fill="isPressed('r3') ? 'var(--cs-accent-blue)' : 'var(--cs-viz-bg)'" :stroke="isPressed('r3') ? 'var(--cs-accent-blue)' : 'var(--cs-viz-stroke-focus)'" stroke-width="3" />
          </g>

          <!-- L2 Trigger — 60×22 pill, fills bottom-up -->
          <g transform="translate(100, 16)">
            <rect x="-30" y="-11" width="60" height="22" rx="5"
              fill="var(--cs-viz-bg)"
              :stroke="triggerL > 0 ? 'var(--cs-accent-blue)' : 'var(--cs-viz-stroke)'"
              stroke-width="1.5" />
            <rect x="-30" :y="11 - triggerLH" width="60" :height="triggerLH"
              fill="var(--cs-accent-blue)" clip-path="url(#viz-trigger-clip)" opacity="0.85" />
            <text x="0" y="0" text-anchor="middle" dominant-baseline="middle"
              :fill="triggerL > 0 ? 'white' : 'var(--cs-viz-text)'"
              font-size="7" font-weight="bold" :opacity="triggerL > 0 ? 0.9 : 0.55">L2</text>
          </g>
          <!-- R2 Trigger -->
          <g transform="translate(300, 16)">
            <rect x="-30" y="-11" width="60" height="22" rx="5"
              fill="var(--cs-viz-bg)"
              :stroke="triggerR > 0 ? 'var(--cs-accent-blue)' : 'var(--cs-viz-stroke)'"
              stroke-width="1.5" />
            <rect x="-30" :y="11 - triggerRH" width="60" :height="triggerRH"
              fill="var(--cs-accent-blue)" clip-path="url(#viz-trigger-clip)" opacity="0.85" />
            <text x="0" y="0" text-anchor="middle" dominant-baseline="middle"
              :fill="triggerR > 0 ? 'white' : 'var(--cs-viz-text)'"
              font-size="7" font-weight="bold" :opacity="triggerR > 0 ? 0.9 : 0.55">R2</text>
          </g>

          <!-- L1 Bumper — wide pill, fully rounded ends -->
          <g class="transition-all duration-150" :transform="`translate(100, 38) ${isPressed('lb') ? 'translate(0, 2)' : ''}`">
            <rect x="-30" y="-6" width="60" height="13" rx="6.5"
              :fill="isPressed('lb') ? 'var(--cs-accent-blue)' : 'var(--cs-viz-bg)'"
              :stroke="isPressed('lb') ? 'var(--cs-accent-blue)' : 'var(--cs-viz-stroke)'"
              stroke-width="1.5" :filter="isPressed('lb') ? 'url(#glow)' : ''" />
            <text x="0" y="0.5" text-anchor="middle" dominant-baseline="middle"
              :fill="isPressed('lb') ? 'white' : 'var(--cs-viz-text)'"
              font-size="8" font-weight="bold" :opacity="isPressed('lb') ? 0.9 : 0.6">L1</text>
          </g>
          <!-- R1 Bumper -->
          <g class="transition-all duration-150" :transform="`translate(300, 38) ${isPressed('rb') ? 'translate(0, 2)' : ''}`">
            <rect x="-30" y="-6" width="60" height="13" rx="6.5"
              :fill="isPressed('rb') ? 'var(--cs-accent-blue)' : 'var(--cs-viz-bg)'"
              :stroke="isPressed('rb') ? 'var(--cs-accent-blue)' : 'var(--cs-viz-stroke)'"
              stroke-width="1.5" :filter="isPressed('rb') ? 'url(#glow)' : ''" />
            <text x="0" y="0.5" text-anchor="middle" dominant-baseline="middle"
              :fill="isPressed('rb') ? 'white' : 'var(--cs-viz-text)'"
              font-size="8" font-weight="bold" :opacity="isPressed('rb') ? 0.9 : 0.6">R1</text>
          </g>

          <!-- Hub Elements -->
          <rect x="150" y="57" width="100" height="60" rx="10" :fill="isPressed('guide') ? 'rgba(79, 140, 255, 0.1)' : 'var(--cs-viz-glass)'" :stroke="isPressed('guide') ? 'var(--cs-accent-blue)' : 'var(--cs-viz-stroke)'" stroke-width="2" />
          <g transform="translate(138, 65)"><rect x="-6" y="-12" width="12" height="24" rx="6" transform="rotate(-15)" :fill="isPressed('back') ? 'var(--cs-accent-blue)' : 'var(--cs-viz-bg)'" :stroke="isPressed('back') ? 'var(--cs-accent-blue)' : 'var(--cs-viz-stroke)'" stroke-width="2" /></g>
          <g transform="translate(262, 65)"><rect x="-6" y="-12" width="12" height="24" rx="6" transform="rotate(15)" :fill="isPressed('start') ? 'var(--cs-accent-blue)' : 'var(--cs-viz-bg)'" :stroke="isPressed('start') ? 'var(--cs-accent-blue)' : 'var(--cs-viz-stroke)'" stroke-width="2" /></g>
          <g transform="translate(200, 132)"><circle r="12" :fill="isPressed('guide') ? 'var(--cs-accent-blue)' : 'var(--cs-viz-bg)'" stroke="var(--cs-viz-stroke)" stroke-width="2.5" /><path d="M-4,0 L4,0 M0,-4 L0,4" stroke="var(--cs-viz-text)" stroke-width="1.5" opacity="0.5" /></g>
        </template>
      </g>
    </svg>

    <!-- Status Bar -->
    <div v-if="!hideStatusBar" class="absolute bottom-2 left-0 right-0 flex justify-center items-center gap-4 px-6 text-[10px] font-black tracking-[0.2em]">
      <div class="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[var(--cs-border)] to-transparent opacity-20"></div>
      <div class="flex items-center gap-3 bg-[var(--cs-bg-card)] border border-[var(--cs-border)] px-4 py-1.5 rounded-full shadow-lg">
        <div :class="['w-2 h-2 rounded-full animate-pulse', layoutInfo.statusColor]"></div>
        <span class="text-[var(--cs-text-secondary)] uppercase">{{ layoutInfo.name }}</span>
      </div>
      <div class="h-[1px] flex-1 bg-gradient-to-l from-transparent via-[var(--cs-border)] to-transparent opacity-20"></div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  buttons: { type: Number, default: 0 },
  leftStickX: { type: Number, default: 0 },
  leftStickY: { type: Number, default: 0 },
  rightStickX: { type: Number, default: 0 },
  rightStickY: { type: Number, default: 0 },
  profileName: { type: String, default: 'Generic' },
  triggerL: { type: Number, default: 0 },
  triggerR: { type: Number, default: 0 },
  hideStatusBar: { type: Boolean, default: false },
})

const visualType = computed(() => {
  if (!props.profileName) return 'xbox'
  const p = props.profileName.toLowerCase()
  if (p.includes('dual') || p.includes('playstation') || p.includes('ps4') || p.includes('ps5')) return 'ps'
  if (p.includes('switch') || p.includes('nintendo') || p.includes('pro controller')) return 'switch'
  return 'xbox'
})

const layoutInfo = computed(() => {
  switch (visualType.value) {
    case 'ps': return { name: 'DualSense Controller Layout', statusColor: 'bg-blue-500' }
    case 'switch': return { name: 'Switch Pro Controller Layout', statusColor: 'bg-red-500' }
    default: return { name: 'Xbox Controller Layout', statusColor: 'bg-green-500' }
  }
})

const faceButtons = computed(() => {
  if (visualType.value === 'xbox') {
    return [
      { key: 'y', label: 'Y', color: 'var(--cs-accent-orange)', x: 0, y: -22 },
      { key: 'b', label: 'B', color: 'var(--cs-accent-red)', x: 22, y: 0 },
      { key: 'a', label: 'A', color: 'var(--cs-accent-green)', x: 0, y: 22 },
      { key: 'x', label: 'X', color: 'var(--cs-accent-blue)', x: -22, y: 0 },
    ]
  } else {
    // Switch Layout
    return [
      { key: 'y', label: 'X', color: 'var(--cs-accent-blue)', x: 0, y: -22 },
      { key: 'b', label: 'A', color: 'var(--cs-accent-red)', x: 22, y: 0 },
      { key: 'a', label: 'B', color: 'var(--cs-accent-orange)', x: 0, y: 22 },
      { key: 'x', label: 'Y', color: 'var(--cs-accent-green)', x: -22, y: 0 },
    ]
  }
})

// triggerLH/triggerRH: fill height in px (0–22) for bottom-up fill inside the 60×22 trigger shape
const triggerLH = computed(() => (props.triggerL / 255) * 22)
const triggerRH = computed(() => (props.triggerR / 255) * 22)

const triggerLabels = computed(() => {
  if (visualType.value === 'switch') return { l: 'ZL', r: 'ZR' }
  return { l: 'LT', r: 'RT' }
})

const BUTTON_MAP = {
  up: 0x0001, down: 0x0002, left: 0x0004, right: 0x0008,
  start: 0x0010, back: 0x0020, l3: 0x0040, r3: 0x0080,
  lb: 0x0100, rb: 0x0200, guide: 0x0400,
  a: 0x1000, b: 0x2000, x: 0x4000, y: 0x8000,
}

function isPressed(btn) { return (props.buttons & BUTTON_MAP[btn]) !== 0 }
</script>
