<template>
  <div class="h-full flex flex-col gap-4 overflow-hidden">
    <!-- Header / Controls -->
    <div class="cs-card flex flex-wrap items-center justify-between gap-4 p-4 shrink-0">
      <div class="flex items-center gap-4">
        <!-- Axis Selector -->
        <div class="flex items-center gap-2">
          <label class="text-xs text-[var(--cs-text-secondary)] uppercase">{{ $t('tests.axis') }}</label>
          <div class="flex bg-[var(--cs-bg-primary)] rounded-lg p-1 border border-[var(--cs-border)]">
            <button 
              v-for="axis in axes" 
              :key="axis.id"
              @click="currentAxis = axis.id; resetTest()"
              class="px-3 py-1 text-xs rounded transition-colors cs-mono"
              :class="currentAxis === axis.id ? 'bg-[var(--cs-accent-blue)] text-white' : 'text-[var(--cs-text-secondary)] hover:text-[var(--cs-text-primary)]'"
            >
              {{ axis.label }}
            </button>
          </div>
        </div>
        
        <!-- Mode Selector -->
        <div class="flex items-center gap-2 border-l border-[var(--cs-border)] pl-4">
          <button 
            @click="setMode('resolution')" 
            class="px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all flex items-center gap-2"
            :class="mode === 'resolution' 
              ? 'bg-[var(--cs-accent-blue)]/10 border-[var(--cs-accent-blue)] text-[var(--cs-accent-blue)]' 
              : 'border-transparent text-[var(--cs-text-secondary)] hover:bg-[var(--cs-bg-primary)]'"
          >
            <span>📏</span> {{ $t('tests.mode_resolution') }}
          </button>
          <button 
            @click="setMode('noise')" 
            class="px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all flex items-center gap-2"
            :class="mode === 'noise' 
              ? 'bg-[var(--cs-accent-orange)]/10 border-[var(--cs-accent-orange)] text-[var(--cs-accent-orange)]' 
              : 'border-transparent text-[var(--cs-text-secondary)] hover:bg-[var(--cs-bg-primary)]'"
          >
            <span>〰️</span> {{ $t('tests.mode_noise') }}
          </button>
        </div>
      </div>

      <div class="flex items-center gap-4">
        <!-- Status / Instructions -->
        <div class="text-sm text-[var(--cs-text-secondary)] animate-pulse" v-if="isRunning">
          {{ mode === 'resolution' ? $t('tests.instr_resolution') : $t('tests.instr_noise') }}
        </div>
        
        <!-- Action Buttons -->
        <button 
          @click="toggleTest"
          class="px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg border transition-colors min-w-[80px]"
          :class="isRunning 
            ? 'bg-[var(--cs-accent-red)]/10 border-[var(--cs-accent-red)] text-[var(--cs-accent-red)] hover:bg-[var(--cs-accent-red)]/20' 
            : 'bg-[var(--cs-accent-green)]/10 border-[var(--cs-accent-green)] text-[var(--cs-accent-green)] hover:bg-[var(--cs-accent-green)]/20'"
        >
          {{ isRunning ? $t('common.stop') : $t('common.start') }}
        </button>
        <button 
          @click="resetTest"
          class="px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg border border-[var(--cs-border)] text-[var(--cs-text-secondary)] hover:bg-[var(--cs-bg-primary)] hover:text-[var(--cs-text-primary)] transition-colors"
        >
          {{ $t('common.reset') }}
        </button>
      </div>
    </div>

    <!-- Main Content Grid -->
    <div class="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-4 min-h-100">
      
      <!-- Graph Area -->
      <div 
        class="col-span-1 lg:col-span-3 cs-card relative flex flex-col overflow-hidden group"
        :class="isDragging ? 'cursor-grabbing' : 'cursor-crosshair'"
      >
        <div class="absolute top-4 right-4 z-10 flex gap-2">
             <div class="flex gap-2">
                <button 
                  v-if="zoomX !== 1.0 || zoomY !== 1.0 || offsetY !== 0"
                  @click="resetView"
                  class="text-[10px] cs-mono px-2 py-1 rounded bg-[var(--cs-accent-blue)] text-white hover:bg-[var(--cs-accent-blue)]/80 transition-colors shadow-lg"
                >
                   {{ $t('tests.reset_view') }}
                </button>
                <div class="text-[10px] cs-mono px-2 py-1 rounded bg-[var(--cs-bg-primary)] text-[var(--cs-text-secondary)] border border-[var(--cs-border)] shadow-sm">
                   ⏱️ {{ (timeWindow / zoomX / 1000).toFixed(1) }}s 
                   <span class="mx-1 opacity-30">|</span> 
                   🔍 {{ zoomY.toFixed(1) }}x
                </div>
             </div>
        </div>
        
        <!-- Zoom hints -->
        <div class="absolute bottom-2 left-4 z-10 opacity-0 group-hover:opacity-60 transition-opacity text-[10px] text-[var(--cs-text-secondary)] pointer-events-none">
            Scroll: Zoom Time &nbsp;•&nbsp; Shift+Scroll: Zoom Amp &nbsp;•&nbsp; Drag: Pan Y
        </div>

        <canvas 
            ref="canvasRef" 
            class="w-full h-full"
            @wheel="handleWheel"
            @mousedown="handleMouseDown"
            @mousemove="handleMouseMove"
            @mouseup="handleMouseUp"
            @mouseleave="handleMouseUp"
        ></canvas>
      </div>

      <!-- Stats Panel -->
      <div class="col-span-1 cs-card flex flex-col gap-4 p-4 overflow-y-auto">
        
        <div v-if="mode === 'resolution'" class="flex flex-col gap-4">
          <div class="p-3 rounded-lg bg-[var(--cs-bg-primary)] border border-[var(--cs-border)] flex flex-col">
            <div class="text-xs text-[var(--cs-text-secondary)] uppercase mb-1">{{ $t('tests.unique_values') }}</div>
            <div class="text-2xl font-bold text-[var(--cs-accent-blue)]">{{ uniqueCount }}</div>
            <div class="text-[10px] text-[var(--cs-text-secondary)] mt-1">{{ $t('tests.unique_desc') }}</div>
          </div>
          
          <div class="p-3 rounded-lg bg-[var(--cs-bg-primary)] border border-[var(--cs-border)] flex flex-col">
            <div class="text-xs text-[var(--cs-text-secondary)] uppercase mb-1">{{ $t('tests.min_step') }}</div>
            <div class="text-2xl font-bold cs-mono text-[var(--cs-accent-purple)]">{{ minStep.toFixed(6) }}</div>
            <div class="text-[10px] text-[var(--cs-text-secondary)] mt-1">{{ $t('tests.min_step_sub') }}</div>
          </div>

          <div class="p-3 rounded-lg bg-[var(--cs-bg-primary)] border border-[var(--cs-border)]">
             <div class="text-xs text-[var(--cs-text-secondary)] uppercase mb-1">{{ $t('tests.est_bit_depth') }}</div>
             <div class="text-3xl font-black text-[var(--cs-text-primary)]">
                {{ bitDepth }} <span class="text-sm font-normal text-[var(--cs-text-secondary)]">bits</span>
             </div>
             <div class="mt-2 h-1.5 w-full bg-[var(--cs-border)] rounded-full overflow-hidden">
                <div class="h-full bg-gradient-to-r from-[var(--cs-accent-red)] via-[var(--cs-accent-orange)] to-[var(--cs-accent-green)] transition-all duration-500"
                     :style="{ width: Math.min((parseFloat(bitDepth) / 16) * 100, 100) + '%' }"></div>
             </div>
             <div class="mt-2 text-xs font-bold" :class="gradeColor">
                {{ $t('tests.grade_' + grade) }}
             </div>
          </div>
        </div>

        <div v-else class="flex flex-col gap-4">
           <div class="p-3 rounded-lg bg-[var(--cs-bg-primary)] border border-[var(--cs-border)] flex flex-col">
            <div class="text-xs text-[var(--cs-text-secondary)] uppercase mb-1">{{ $t('tests.jitter_mean') }}</div>
            <div class="text-2xl font-bold text-[var(--cs-text-primary)] cs-mono">{{ noiseStats.mean.toFixed(5) }}</div>
          </div>
          <div class="p-3 rounded-lg bg-[var(--cs-bg-primary)] border border-[var(--cs-border)] flex flex-col">
            <div class="text-xs text-[var(--cs-text-secondary)] uppercase mb-1">{{ $t('tests.jitter_std') }}</div>
            <div class="text-2xl font-bold cs-mono text-[var(--cs-accent-orange)]">{{ noiseStats.std.toFixed(6) }}</div>
            <div class="text-[10px] text-[var(--cs-text-secondary)] mt-1">{{ $t('tests.jitter_std_desc') }}</div>
          </div>
          
           <div class="p-3 rounded-lg bg-[var(--cs-bg-primary)] border border-[var(--cs-border)] flex flex-col">
            <div class="text-xs text-[var(--cs-text-secondary)] uppercase mb-1">{{ $t('tests.jitter_max_min') }}</div>
            <div class="text-2xl font-bold text-[var(--cs-text-primary)] cs-mono">{{ (noiseStats.max - noiseStats.min).toFixed(5) }}</div>
          </div>
        </div>

        <!-- Realtime Value -->
        <div class="mt-auto pt-4 border-t border-[var(--cs-border)]">
          <div class="flex justify-between items-end">
            <span class="text-xs text-[var(--cs-text-secondary)]">{{ $t('tests.current_value') }}</span>
            <span class="text-xl font-mono text-[var(--cs-text-primary)]">{{ currentValue.toFixed(5) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted, watch } from 'vue'

const props = defineProps({
  state: Object,
  isActive: { type: Boolean, default: true }
})

const canvasRef = ref(null)
const currentAxis = ref('lx')
const mode = ref('resolution') // 'resolution' | 'noise'
const isRunning = ref(false)

// Data Aggregation
const uniqueValues = reactive(new Set())
const minStep = ref(1.0)
const minStepCandidates = reactive([]) // Store candidates to filter outliers
const noiseData = reactive([])

// Visualization Buffer
const timeWindow = 5000 // Default 5s view
const maxHistoryTime = 20000 // Keep 20s in buffer
let historyBuffer = [] 

// Zoom & Pan State
const zoomX = ref(1.0)
const zoomY = ref(1.0)
const offsetY = ref(0) // Vertical pan
const isDragging = ref(false)
let lastMouseY = 0

const currentValue = computed(() => {
  if (!props.state) return 0
  switch (currentAxis.value) {
    case 'lx': return props.state.leftStickCurrent.x
    case 'ly': return props.state.leftStickCurrent.y
    case 'rx': return props.state.rightStickCurrent.x
    case 'ry': return props.state.rightStickCurrent.y
    default: return 0
  }
})

const axes = [
  { id: 'lx', label: 'Left X' },
  { id: 'ly', label: 'Left Y' },
  { id: 'rx', label: 'Right X' },
  { id: 'ry', label: 'Right Y' },
]
const uniqueCount = computed(() => uniqueValues.size)
const bitDepth = computed(() => {
    if (minStep.value >= 1.0 || minStep.value <= 0) return "0"
    const bits = Math.log2(2.0 / minStep.value)
    return Math.max(0, Math.min(16, bits)).toFixed(1)
})

const grade = computed(() => {
    const bits = parseFloat(bitDepth.value)
    if (bits < 8) return 'low'
    if (bits < 10) return 'mid'
    if (bits < 12) return 'high'
    return 'pro'
})

const gradeColor = computed(() => {
    switch (grade.value) {
        case 'low': return 'text-[var(--cs-accent-red)]'
        case 'mid': return 'text-[var(--cs-text-primary)]'
        case 'high': return 'text-[var(--cs-accent-green)]'
        case 'pro': return 'text-[var(--cs-accent-purple)]'
    }
})

const noiseStats = computed(() => {
    if (noiseData.length === 0) return { mean: 0, std: 0, min: 0, max: 0 }
    
    const n = noiseData.length
    const mean = noiseData.reduce((a, b) => a + b, 0) / n
    const variance = noiseData.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / n
    const std = Math.sqrt(variance)
    const min = Math.min(...noiseData)
    const max = Math.max(...noiseData)
    
    return { mean, std, min, max }
})

// Lifecycle & Control
function setMode(newMode) {
  mode.value = newMode
  resetTest()
}

function toggleTest() {
  isRunning.value = !isRunning.value
}

function resetTest() {
  isRunning.value = false
  uniqueValues.clear()
  minStep.value = 1.0
  minStepCandidates.length = 0
  noiseData.length = 0
  historyBuffer = []
}

function resetView() {
    zoomX.value = 1.0
    zoomY.value = 1.0
    offsetY.value = 0
}

// Interaction Handlers
function handleWheel(e) {
    e.preventDefault()
    
    // Shift key: Zoom Amplitude (Y)
    if (e.shiftKey) {
        const delta = e.deltaY > 0 ? 0.9 : 1.1
        zoomY.value = Math.max(0.1, Math.min(500.0, zoomY.value * delta))
    } 
    // Default: Zoom Time (X)
    else {
        const delta = e.deltaY > 0 ? 0.9 : 1.1
        zoomX.value = Math.max(0.2, Math.min(50.0, zoomX.value * delta))
    }
}

function handleMouseDown(e) {
    if (e.button === 1 || e.button === 0) { // Middle or Left click to drag
        isDragging.value = true
        lastMouseY = e.clientY
    }
}

function handleMouseMove(e) {
    if (!isDragging.value) return
    const dy = e.clientY - lastMouseY
    lastMouseY = e.clientY
    
    // Pan Y
    // Convert pixels to value units approx (not precise but functional)
    offsetY.value -= dy * 0.005 / zoomY.value
}

function handleMouseUp() {
    isDragging.value = false
}

// Loop
let animFrame = null
let lastVal = null

// Cached theme colors — updated on mount and theme change, not per-frame
const cachedColors = {
  bg: '#161b22',
  grid: '#30363d',
  accentResolution: '#58a6ff',
  accentNoise: '#d29922',
  textPrimary: '#ffffff'
}

function updateCachedColors() {
  const style = getComputedStyle(document.body)
  cachedColors.bg = style.getPropertyValue('--cs-bg-card').trim() || '#161b22'
  cachedColors.grid = style.getPropertyValue('--cs-border').trim() || '#30363d'
  cachedColors.accentResolution = style.getPropertyValue('--cs-accent-blue').trim() || '#58a6ff'
  cachedColors.accentNoise = style.getPropertyValue('--cs-accent-orange').trim() || '#d29922'
  cachedColors.textPrimary = style.getPropertyValue('--cs-text-primary').trim() || '#ffffff'
}

let themeObserver = null

function update() {
  if (props.state && props.state.connected) {
    const now = performance.now()
    const val = currentValue.value
    
    // Add to history
    historyBuffer.push({ t: now, v: val })
    
    // Prune history in bulk to avoid O(n) shift() per frame
    if (historyBuffer.length > 2000) {
      const cutoff = now - maxHistoryTime
      let pruneIdx = 0
      while (pruneIdx < historyBuffer.length && historyBuffer[pruneIdx].t < cutoff) pruneIdx++
      if (pruneIdx > 0) historyBuffer.splice(0, pruneIdx)
    }

    if (isRunning.value) {
      if (mode.value === 'resolution') {
        uniqueValues.add(val)
        
        if (lastVal !== null) {
          const delta = Math.abs(val - lastVal)
          if (delta > 0.00001) {
             if (delta < minStep.value) {
                 minStep.value = delta
             }
          }
        }
      } else if (mode.value === 'noise') {
         noiseData.push(val)
         if (noiseData.length > 500) noiseData.shift()
      }
    }
    
    lastVal = val
  }
  
  draw()
  animFrame = requestAnimationFrame(update)
}

// Pause/resume rAF loop based on tab visibility
watch(() => props.isActive, (active) => {
  if (active) {
    if (!animFrame) {
      animFrame = requestAnimationFrame(update)
    }
  } else {
    if (animFrame) {
      cancelAnimationFrame(animFrame)
      animFrame = null
    }
  }
})

// Drawing using Canvas API
function draw() {
    const canvas = canvasRef.value
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const width = canvas.width
    const height = canvas.height
    
    // Theme Colors (cached, not read per-frame)
    const bg = cachedColors.bg
    const grid = cachedColors.grid
    const accent = mode.value === 'resolution' ? cachedColors.accentResolution : cachedColors.accentNoise
    
    ctx.fillStyle = bg
    ctx.fillRect(0, 0, width, height)
    
    // Calculate View Parameters
    const currentWindow = timeWindow / zoomX.value
    
    // Draw Grid
    ctx.strokeStyle = grid
    ctx.lineWidth = 1
    ctx.beginPath()
    const midY = height / 2
    
    // Main Axis
    ctx.moveTo(0, midY + offsetY.value * (height/2)); 
    ctx.lineTo(width, midY + offsetY.value * (height/2));
    ctx.stroke()
    
    if (historyBuffer.length === 0) return

    // Draw Graph
    ctx.strokeStyle = accent
    ctx.lineWidth = 2
    ctx.lineJoin = 'bevel' 
    ctx.beginPath()

    const now = performance.now()
    const tStart = now - currentWindow

    let first = true
    for (const p of historyBuffer) {
        // Skip points outside current X view (too old)
        if (p.t < tStart) continue;
        
        const x = ((p.t - tStart) / currentWindow) * width
        
        // Y Mapping:
        // Raw Value (v) -> Zoomed & Panned Y
        // Center = midY
        // Scale = height/2 * zoomY
        // Pan = offsetY (Value units)
        
        const effectiveVal = (p.v - offsetY.value)
        const y = midY - (effectiveVal * (height / 2 - 20) * zoomY.value)
        
        if (first) {
            ctx.moveTo(x, y)
            first = false
        } else {
            ctx.lineTo(x, y)
        }
    }
    ctx.stroke()
    
    // Current point
    const lastP = historyBuffer[historyBuffer.length - 1]
    const lx = width
    // Draw current point if visible
    const effectiveVal = (lastP.v - offsetY.value)
    const ly = midY - (effectiveVal * (height / 2 - 20) * zoomY.value)
    
    ctx.fillStyle = cachedColors.textPrimary
    ctx.beginPath()
    ctx.arc(lx, ly, 4, 0, Math.PI * 2)
    ctx.fill()
}

// Resize Handling
let resizeObserver = null

function handleResize() {
    const canvas = canvasRef.value
    if (canvas) {
        const dpr = window.devicePixelRatio || 1
        const rect = canvas.getBoundingClientRect()
        // Set physical size
        canvas.width = rect.width * dpr
        canvas.height = rect.height * dpr
        // Do NOT scale context here, we work in physical pixels in draw()
        // This avoids double-scaling confusion
    }
}

onMounted(() => {
    updateCachedColors()
    handleResize()

    if (canvasRef.value) {
        resizeObserver = new ResizeObserver(() => handleResize())
        resizeObserver.observe(canvasRef.value.parentElement)
    }

    // Watch for theme changes (class on <html> or <body>)
    themeObserver = new MutationObserver(updateCachedColors)
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'data-theme'] })

    window.addEventListener('resize', handleResize)
    animFrame = requestAnimationFrame(update)
})

onUnmounted(() => {
    if (animFrame) cancelAnimationFrame(animFrame)
    if (resizeObserver) resizeObserver.disconnect()
    if (themeObserver) themeObserver.disconnect()
    window.removeEventListener('resize', handleResize)
})

</script>
