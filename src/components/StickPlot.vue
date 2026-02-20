<template>
  <div class="stick-plot-container relative">
    <div class="flex items-center justify-between mb-2" v-if="!hideControls">
      <h3 class="text-sm font-bold text-[var(--cs-text-primary)] uppercase tracking-wider">{{ label }}</h3>
      <div class="flex gap-1">
        <button 
          @click="cycleMode" 
          class="px-2 py-0.5 text-[10px] rounded bg-[var(--cs-bg-primary)] text-[var(--cs-text-secondary)] hover:text-[var(--cs-accent-blue)] border border-[var(--cs-border)] transition-colors"
        >
          {{ $t('stick.' + renderMode) }}
        </button>
        <button 
          @click="resetZoom" 
          class="px-2 py-0.5 text-[10px] rounded bg-[var(--cs-bg-primary)] border border-[var(--cs-border)] transition-colors"
          :class="(zoomLevel !== 1 || offsetX !== 0 || offsetY !== 0) ? 'text-[var(--cs-accent-blue)] border-[var(--cs-accent-blue)]' : 'text-[var(--cs-text-secondary)] hover:text-[var(--cs-accent-blue)]'"
          :title="$t('stick.zoom_help', { zoom: zoomLevel.toFixed(1) })"
        >
          🔍 {{ zoomLevel.toFixed(1) }}x
        </button>
        <button 
          @click="locked = !locked" 
          class="px-2 py-0.5 text-[10px] rounded bg-[var(--cs-bg-primary)] border border-[var(--cs-border)] transition-colors"
          :class="locked ? 'text-[var(--cs-accent-orange)] border-[var(--cs-accent-orange)]' : 'text-[var(--cs-text-secondary)] hover:text-[var(--cs-accent-orange)]'"
        >
          {{ locked ? '⏸' : '▶' }}
        </button>
        <button 
          @click="clearTrail" 
          class="px-2 py-0.5 text-[10px] rounded bg-[var(--cs-bg-primary)] text-[var(--cs-text-secondary)] hover:text-[var(--cs-accent-red)] border border-[var(--cs-border)] transition-colors"
        >
          ✕
        </button>
      </div>
    </div>
    <div 
      class="relative w-full overflow-hidden rounded-lg" 
      style="padding-bottom: 100%;"
      :class="isDragging ? 'cursor-grabbing' : 'cursor-default'"
      @wheel.prevent="handleWheel"
      @mousedown="handleMouseDown"
      @mousemove="handleMouseMove"
      @mouseup="handleMouseUp"
      @mouseleave="handleMouseUp"
    >
      <canvas 
        ref="canvasRef" 
        class="absolute inset-0 w-full h-full"
        style="background: var(--cs-bg-primary);"
      ></canvas>

       <!-- Circularity Stats Overlay -->
      <div v-if="isCircularityMode" class="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div class="text-center bg-black/50 backdrop-blur-sm p-2 rounded-lg">
           <div class="text-[10px] text-white/70 uppercase">{{ $t('stick.avg_error') }}</div>
           <div class="text-xl font-bold font-mono text-white">{{ (avgError * 100).toFixed(1) }}%</div>
        </div>
      </div>
    </div>
    <div class="mt-2 flex justify-between items-center cs-mono text-[11px] text-(--cs-text-secondary)" v-if="!hideControls">
      <div class="flex gap-4">
          <span>X: <span class="text-[var(--cs-text-primary)]">{{ currentX.toFixed(4) }}</span></span>
          <span>Y: <span class="text-[var(--cs-text-primary)]">{{ currentY.toFixed(4) }}</span></span>
      </div>
      
      <!-- Circularity Toggle -->
      <label class="flex items-center gap-1.5 cursor-pointer hover:text-(--cs-text-primary) transition-colors select-none">
        <input type="checkbox" v-model="isCircularityMode" class="accent-(--cs-accent-blue)">
        <span>{{ $t('stick.circularity_test') }}</span>
      </label>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue'

const props = defineProps({
  label: { type: String, default: 'Stick' },
  points: { type: Array, default: () => [] }, // [{x, y, t}, ...]
  maxPoints: { type: Number, default: 2500 },
  isActive: { type: Boolean, default: true },
  hideControls: { type: Boolean, default: false },  // overlay mode: hide all UI chrome
  resetSignal: { type: Number, default: 0 }          // increment to clear the trail
})

const canvasRef = ref(null)
const renderMode = ref('dots') // 'dots' | 'line' | 'both'
const zoomLevel = ref(1.0)
const offsetX = ref(0)
const offsetY = ref(0)
const locked = ref(false)
const pointCount = ref(0) // Separate reactive counter for UI
const currentX = ref(0)
const currentY = ref(0)

// Circularity State
const isCircularityMode = ref(false)
const circularityData = new Float32Array(360).fill(0)
const avgError = ref(0)

// Auto-clear when disabling circularity mode
watch(isCircularityMode, (newVal) => {
  if (!newVal) {
    clearTrail()
  }
})

// Non-reactive circular buffer for high performance trail rendering
// Avoids array allocation when buffer exceeds maxPoints
let trailBuffer = []
let trailHead = 0   // write pointer
let trailSize = 0   // current number of valid points

// Theme color management
const themeColors = {
  bg: '#0f1117',
  grid: 'rgba(255, 255, 255, 0.05)',
  gridLine: 'rgba(255, 255, 255, 0.12)',
  dot: '#f43f5e',
  circle: 'rgba(79, 140, 255, 0.3)',
  text: '#ffffff',
  // New colors
  fillBlue: 'rgba(79, 140, 255, 0.5)', 
  fillOrange: 'rgba(255, 140, 0, 0.8)', // For overshoot
  fillGreen: 'rgba(50, 200, 100, 0.6)'
}

function updateThemeColors() {
  const style = getComputedStyle(document.documentElement)
  const hasBg = document.documentElement.classList.contains('has-bg')
  // In overlay (hideControls) mode, always use transparent canvas background so only
  // the drawn elements (grid, circle, dots) are visible over the OBS chroma key.
  // 在覆盖层模式下，始终使用透明 canvas 背景，使 OBS 只采集绘制的元素。
  themeColors.bg = (hasBg || props.hideControls) ? 'transparent' : (style.getPropertyValue('--cs-bg-primary').trim() || '#0f1117')
  themeColors.grid = style.getPropertyValue('--cs-grid-color').trim() || 'rgba(255, 255, 255, 0.05)'
  themeColors.gridLine = style.getPropertyValue('--cs-grid-line').trim() || 'rgba(255, 255, 255, 0.12)'
  themeColors.dot = style.getPropertyValue('--cs-viz-dot').trim() || '#f43f5e'
  themeColors.circle = style.getPropertyValue('--cs-viz-circle').trim() || 'rgba(79, 140, 255, 0.3)'
  themeColors.text = style.getPropertyValue('--cs-text-primary').trim() || '#ffffff'

  // You could also extract these from CSS variables if you defined them
  offscreenDirty = true
}

let ctx = null
let canvasSize = 0
let dpr = 1
let animFrameId = null

// Offscreen canvas for static background (grid, crosshair, boundaries)
let offscreenCanvas = null
let offscreenCtx = null
let offscreenDirty = true  // true = needs redraw

// Track last zoom/offset to detect when background must be redrawn
let lastBgZoom = -1
let lastBgOffsetX = -1
let lastBgOffsetY = -1

// Dragging state
const isDragging = ref(false)
let lastMouseX = 0
let lastMouseY = 0

function cycleMode() {
  const modes = ['dots', 'line', 'both']
  const idx = modes.indexOf(renderMode.value)
  renderMode.value = modes[(idx + 1) % modes.length]
}

function handleWheel(e) {
  const delta = e.deltaY > 0 ? 0.9 : 1.1
  const nextZoom = zoomLevel.value * delta
  zoomLevel.value = Math.max(0.01, Math.min(500, nextZoom))
}

function handleMouseDown(e) {
  if (e.button === 1) { // Middle button
    isDragging.value = true
    lastMouseX = e.clientX
    lastMouseY = e.clientY
    e.preventDefault()
  }
}

function handleMouseMove(e) {
  if (isDragging.value) {
    const dx = e.clientX - lastMouseX
    const dy = e.clientY - lastMouseY
    offsetX.value += dx
    offsetY.value += dy
    lastMouseX = e.clientX
    lastMouseY = e.clientY
  }
}

function handleMouseUp() {
  isDragging.value = false
}

function resetZoom() {
  if (zoomLevel.value === 1.0 && offsetX.value === 0 && offsetY.value === 0) {
    zoomLevel.value = 10.0
  } else {
    zoomLevel.value = 1.0
    offsetX.value = 0
    offsetY.value = 0
  }
}

function clearTrail() {
  trailBuffer = new Array(props.maxPoints)
  trailHead = 0
  trailSize = 0
  pointCount.value = 0

  // Also reset circularity data
  circularityData.fill(0)
  avgError.value = 0
}

function initCanvas() {
  const canvas = canvasRef.value
  if (!canvas) return

  dpr = window.devicePixelRatio || 1
  const rect = canvas.getBoundingClientRect()
  canvasSize = Math.floor(rect.width)
  canvas.width = canvasSize * dpr
  canvas.height = canvasSize * dpr
  ctx = canvas.getContext('2d', { alpha: true })
  ctx.scale(dpr, dpr)

  // Init offscreen canvas at same logical size
  offscreenCanvas = document.createElement('canvas')
  offscreenCanvas.width = canvasSize * dpr
  offscreenCanvas.height = canvasSize * dpr
  offscreenCtx = offscreenCanvas.getContext('2d', { alpha: true })
  offscreenCtx.scale(dpr, dpr)

  offscreenDirty = true
  updateThemeColors()
}

// Convert normalized [-1, 1] coordinates to canvas pixels
function toCanvasX(val, zoom) {
  const half = canvasSize / 2
  const scale = (half - 8) * zoom
  return half + val * scale + offsetX.value
}

function toCanvasY(val, zoom) {
  const half = canvasSize / 2
  const scale = (half - 8) * zoom
  return half + val * scale + offsetY.value
}

function drawStaticBackground(zoom, halfX, halfY) {
  const size = canvasSize
  const oc = offscreenCtx
  const radiusPx = (size / 2 - 8) * zoom

  if (themeColors.bg === 'transparent') {
    oc.clearRect(0, 0, size, size)
  } else {
    oc.fillStyle = themeColors.bg
    oc.fillRect(0, 0, size, size)
  }

  // Grid lines
  oc.strokeStyle = themeColors.grid
  oc.lineWidth = 1
  const steps = [0.25, 0.5, 0.75, 1.0, -0.25, -0.5, -0.75, -1.0]
  steps.forEach(val => {
    const px = halfX + val * (size / 2 - 8) * zoom
    const py = halfY + val * (size / 2 - 8) * zoom
    if (px >= 0 && px <= size) {
      oc.beginPath(); oc.moveTo(px, 0); oc.lineTo(px, size); oc.stroke()
    }
    if (py >= 0 && py <= size) {
      oc.beginPath(); oc.moveTo(0, py); oc.lineTo(size, py); oc.stroke()
    }
  })

  // Center crosshair
  oc.strokeStyle = themeColors.gridLine
  oc.lineWidth = 1.5
  if (halfX >= 0 && halfX <= size) {
    oc.beginPath(); oc.setLineDash([5, 5]); oc.moveTo(halfX, 0); oc.lineTo(halfX, size); oc.stroke(); oc.setLineDash([])
  }
  if (halfY >= 0 && halfY <= size) {
    oc.beginPath(); oc.setLineDash([5, 5]); oc.moveTo(0, halfY); oc.lineTo(size, halfY); oc.stroke(); oc.setLineDash([])
  }

  // Circle boundary
  oc.strokeStyle = themeColors.circle
  oc.lineWidth = 1.5
  oc.beginPath()
  oc.arc(halfX, halfY, radiusPx, 0, Math.PI * 2)
  oc.stroke()

  // Square boundary
  oc.strokeStyle = themeColors.grid
  oc.lineWidth = 1
  oc.setLineDash([2, 2])
  oc.strokeRect(halfX - radiusPx, halfY - radiusPx, radiusPx * 2, radiusPx * 2)
  oc.setLineDash([])
}

function drawFrame() {
  if (!ctx || !canvasSize) {
    animFrameId = requestAnimationFrame(drawFrame)
    return
  }

  const zoom = zoomLevel.value
  const size = canvasSize
  const halfX = size / 2 + offsetX.value
  const halfY = size / 2 + offsetY.value

  // Redraw offscreen background only when zoom/offset/theme changes
  if (offscreenDirty || zoom !== lastBgZoom || offsetX.value !== lastBgOffsetX || offsetY.value !== lastBgOffsetY) {
    drawStaticBackground(zoom, halfX, halfY)
    lastBgZoom = zoom
    lastBgOffsetX = offsetX.value
    lastBgOffsetY = offsetY.value
    offscreenDirty = false
  }

  // Blit static background.
  // Source dimensions must use the offscreen canvas's physical pixel size
  // (canvasSize * dpr), not canvasSize alone — drawImage source coords are
  // always in native image pixels, unaffected by ctx.scale(dpr, dpr).
  // Using canvasSize as source at dpr≠1 reads only 1/dpr of the content
  // and stretches it, making the background circle larger than the drawn
  // points and causing the visible misalignment at non-100% DPI settings.
  if (themeColors.bg === 'transparent') {
    ctx.clearRect(0, 0, size, size)
  }
  ctx.drawImage(offscreenCanvas, 0, 0, offscreenCanvas.width, offscreenCanvas.height, 0, 0, size, size)

  const radiusPx = (canvasSize / 2 - 8) * zoom

  // ─── CIRCULARITY MODE RENDERING ───
  if (isCircularityMode.value) {
    // Draw slices
    const stepRad = (Math.PI * 2) / 360
    
    // We want 0 degrees to be North (Up).
    // In Canvas arc: 0 is East (Right).
    // Gamepad (0,1) is Up (y is inverted in typical screen coords, but let's see how inputs come)
    // The typical gamepad unit circle:
    // Y is usually Down in screen coords, but our helper `toCanvasY` does `offsetY.value`. 
    // In `toCanvasY(-p.y, zoom)` used below implies `p.y` is Up-Positive in logical space, so we flip for canvas.
    // logical (0,1) -> theta = 90 deg (PI/2).
    // atan2(y, x).
    // Let's align with how we calculate theta.
    
    for (let i = 0; i < 360; i++) {
        const val = circularityData[i]
        if (val <= 0.001) continue

        const theta = (i * Math.PI) / 180.0
        const a0 = -theta - stepRad / 2
        const a1 = -theta + stepRad / 2

        if (val > 1.0) {
            // Green: center → circle boundary
            ctx.fillStyle = themeColors.fillGreen
            ctx.beginPath()
            ctx.moveTo(halfX, halfY)
            ctx.arc(halfX, halfY, radiusPx, a0, a1)
            ctx.closePath()
            ctx.fill()

            // Orange: circle boundary → actual reach (annular sector)
            ctx.fillStyle = themeColors.fillOrange
            ctx.beginPath()
            ctx.arc(halfX, halfY, val * radiusPx, a0, a1)
            ctx.arc(halfX, halfY, radiusPx, a1, a0, true)
            ctx.closePath()
            ctx.fill()
        } else {
            // Blue: center → actual reach
            ctx.fillStyle = themeColors.fillBlue
            ctx.beginPath()
            ctx.moveTo(halfX, halfY)
            ctx.arc(halfX, halfY, val * radiusPx, a0, a1)
            ctx.closePath()
            ctx.fill()
        }
    }
    
    // Draw current stick position pointer
    ctx.fillStyle = themeColors.text
    ctx.beginPath()
    const curPx = toCanvasX(currentX.value, zoom)
    const curPy = toCanvasY(-currentY.value, zoom)
    ctx.arc(curPx, curPy, 4, 0, Math.PI * 2)
    ctx.fill()

  } 
  else {
      // ─── STANDARD TRAIL RENDERING ───
      const len = trailSize
      const cap = trailBuffer.length
      // oldest point index in circular buffer
      const startIdx = cap > 0 ? (trailHead - len + cap) % cap : 0
      const getPoint = (i) => trailBuffer[(startIdx + i) % cap]
      const mode = renderMode.value

      if (len > 0) {
        if (mode === 'line' || mode === 'both') {
          ctx.strokeStyle = themeColors.circle
          ctx.lineWidth = 1.5
          ctx.lineJoin = 'round'
          ctx.lineCap = 'round'
          ctx.beginPath()

          let first = true
          for (let i = 0; i < len; i++) {
            const p = getPoint(i)
            const px = toCanvasX(p.x, zoom)
            const py = toCanvasY(-p.y, zoom)

            if (px < -100 || px > size + 100 || py < -100 || py > size + 100) {
              first = true; continue
            }

            if (first) { ctx.moveTo(px, py); first = false }
            else { ctx.lineTo(px, py) }
          }
          ctx.stroke()
        }

        if (mode === 'dots' || mode === 'both') {
          ctx.fillStyle = themeColors.dot

          const oneOverLen = 1 / Math.max(len, 1)

          for (let i = 0; i < len; i++) {
            const age = (len - 1 - i) * oneOverLen
            const alpha = Math.max(0.08, 1.0 - age * 0.9)

            const p = getPoint(i)
            const px = toCanvasX(p.x, zoom)
            const py = toCanvasY(-p.y, zoom)

            if (px < 0 || px > size || py < 0 || py > size) continue

            ctx.globalAlpha = alpha
            ctx.fillRect(Math.floor(px), Math.floor(py), 1.5, 1.5)
          }
          ctx.globalAlpha = 1.0
        }

        const last = getPoint(len - 1)
        const lx = toCanvasX(last.x, zoom)
        const ly = toCanvasY(-last.y, zoom)
        if (lx >= 0 && lx <= size && ly >= 0 && ly <= size) {
          ctx.fillStyle = themeColors.text
          ctx.beginPath(); ctx.arc(lx, ly, 3, 0, Math.PI * 2); ctx.fill()
          ctx.strokeStyle = themeColors.dot
          ctx.lineWidth = 1.5
          ctx.stroke()
        }
      }
  }

  animFrameId = requestAnimationFrame(drawFrame)
}

watch(() => props.points, (newPoints) => {
  if (!newPoints || newPoints.length === 0) return
  
  if (locked.value) return;

  // 1. Handle Standard Trail Buffer
  if (!isCircularityMode.value) {
    const cap = props.maxPoints
    // Ensure buffer is allocated at correct capacity
    if (trailBuffer.length !== cap) {
      trailBuffer = new Array(cap)
      trailHead = 0
      trailSize = 0
    }
    for (let i = 0; i < newPoints.length; i++) {
      trailBuffer[trailHead] = newPoints[i]
      trailHead = (trailHead + 1) % cap
      if (trailSize < cap) trailSize++
    }
    pointCount.value = trailSize
  }
  
  // 2. Handle Circularity Logic
  // Always update currentXY for display
   const last = newPoints[newPoints.length - 1]
   currentX.value = last.x
   currentY.value = last.y

  if (isCircularityMode.value) {
      // Process new points into bins
      for (const p of newPoints) {
          const x = p.x
          const y = p.y // Logical Y
          const len = Math.sqrt(x*x + y*y)
          
          // Calculate angle. 
          // Atan2(y, x) returns radians in [-PI, PI].
          // 0 is East. PI/2 is North.
          // We map this to 0-360 degrees.
          let theta = Math.atan2(y, x) 
          if (theta < 0) theta += 2 * Math.PI
          
          // Convert to degrees 0-359
          // Note: In logical coords, standard trig applies.
          // In canvas, we used -p.y, so we inverted y for display.
          // But our drawing logic used -theta as well to match? 
          // Let's ensure drawing and calculation match.
          // If we calc theta here using +y (logical up),
          // And drawing uses -theta (canvas y is down = negative logical y),
          // then it should align.
          
          const degrees = (theta * 180.0) / Math.PI
          const idx = Math.floor(degrees) % 360
          
          // Update max radius for this bin
          // Only update if pushed further (max hold)
          if (len > circularityData[idx]) {
              circularityData[idx] = len
          }
      }
      
      // Update Stats
      // Avg Error = sum(|r - 1.0|) / Count of non-zero bins?
      // Or just count all bins? Standard practice usually counts samples collected.
      // But we have 360 bins. Let's count bins that have been visited.
      
      let sumError = 0
      let count = 0
      for(let i=0; i<360; i++) {
          const r = circularityData[i]
          if (r > 0.05) { // Filter center/deadzone noise if needed, or just take non-zero
              sumError += Math.abs(r - 1.0)
              count++
          }
      }
      avgError.value = count > 0 ? (sumError / count) : 0
  }

}, { deep: false })

// Pause/resume rAF loop based on visibility
watch(() => props.isActive, (active) => {
  if (active) {
    if (!animFrameId) {
      animFrameId = requestAnimationFrame(drawFrame)
    }
  } else {
    if (animFrameId) {
      cancelAnimationFrame(animFrameId)
      animFrameId = null
    }
  }
})

// Watch for maxPoints change to truncate immediately
watch(() => props.maxPoints, (newLimit) => {
  // Rebuild circular buffer at new capacity, preserving most recent points
  const cap = trailBuffer.length
  const startIdx = cap > 0 ? (trailHead - trailSize + cap) % cap : 0
  const keepCount = Math.min(trailSize, newLimit)
  const newBuf = new Array(newLimit)
  for (let i = 0; i < keepCount; i++) {
    newBuf[i] = trailBuffer[(startIdx + trailSize - keepCount + i) % cap]
  }
  trailBuffer = newBuf
  trailHead = keepCount % newLimit
  trailSize = keepCount
  pointCount.value = trailSize
})

// Expose reset method for parent
defineExpose({
  reset: clearTrail
})

// External reset signal — used by overlay mode to clear trail on device switch.
// 外部重置信号，用于覆盖层模式在切换设备时清空轨迹。
watch(() => props.resetSignal, () => {
  clearTrail()
})

let observer = null

onMounted(async () => {
  await nextTick()
  initCanvas()
  animFrameId = requestAnimationFrame(drawFrame)
  window.addEventListener('resize', initCanvas)

  // Listen for theme changes
  observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'attributes' &&
          (mutation.attributeName === 'data-theme' || mutation.attributeName === 'class')) {
        updateThemeColors()
      }
    })
  })
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'class'] })
})

onUnmounted(() => {
  if (animFrameId) cancelAnimationFrame(animFrameId)
  window.removeEventListener('resize', initCanvas)
  if (observer) observer.disconnect()
})
</script>
