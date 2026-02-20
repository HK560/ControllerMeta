<template>
  <!-- OBS 覆盖层专用：圆形摇杆轨迹 Canvas，半透明底板，渐变消退光点 -->
  <div class="stick-overlay-wrap">
    <canvas ref="canvasRef"></canvas>
    <span v-if="label" class="stick-label">{{ label }}</span>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue'

const props = defineProps({
  points:      { type: Array,   default: () => [] }, // [{x, y, t}] 每帧批量
  maxPoints:   { type: Number,  default: 2500 },
  label:       { type: String,  default: '' },
  resetSignal: { type: Number,  default: 0 },
  isActive:    { type: Boolean, default: true },
})

const canvasRef = ref(null)

// ─── 非响应式圆形缓冲区（与 StickPlot 同模式，避免响应式开销）──────────
let trailBuffer = []
let trailHead = 0
let trailSize = 0

// ─── Canvas 状态 ──────────────────────────────────────────────────────
let ctx = null
let canvasSize = 0
let dpr = 1
let animFrameId = null
let cx = 0, cy = 0       // 中心坐标（逻辑像素）
let plotRadius = 0        // 摇杆绘图半径（不含内边距）

// ─── 主题颜色 ─────────────────────────────────────────────────────────
const colors = {
  bgCard:  'rgba(26, 29, 39, 0.80)',   // --cs-bg-card + alpha
  accent:  '#4f8cff',                  // --cs-accent-blue
  border:  'rgba(79, 140, 255, 0.25)', // 边界圆
  cross:   'rgba(255, 255, 255, 0.10)',// 十字准星
}

function updateColors() {
  const style = getComputedStyle(document.documentElement)
  const cardRgb = style.getPropertyValue('--cs-card-rgb').trim()
  if (cardRgb) colors.bgCard = `rgba(${cardRgb}, 0.80)`
  const accent = style.getPropertyValue('--cs-accent-blue').trim()
  if (accent) colors.accent = accent
}

// ─── Canvas 初始化（DPR-aware，与 StickPlot 相同模式）────────────────
function initCanvas() {
  const canvas = canvasRef.value
  if (!canvas) return
  dpr = window.devicePixelRatio || 1
  const rect = canvas.getBoundingClientRect()
  canvasSize = Math.floor(rect.width)
  if (canvasSize <= 0) return
  canvas.width  = canvasSize * dpr
  canvas.height = canvasSize * dpr
  ctx = canvas.getContext('2d', { alpha: true })
  ctx.scale(dpr, dpr)
  cx = cy = canvasSize / 2
  plotRadius = (canvasSize / 2) * 0.82  // 留出 18% 边距
  updateColors()
}

// ─── 清空轨迹 ─────────────────────────────────────────────────────────
function clearTrail() {
  trailBuffer = new Array(props.maxPoints)
  trailHead = 0
  trailSize = 0
}

// ─── 每帧渲染 ─────────────────────────────────────────────────────────
function drawFrame() {
  if (!ctx || canvasSize <= 0) {
    animFrameId = requestAnimationFrame(drawFrame)
    return
  }

  const size = canvasSize
  ctx.clearRect(0, 0, size, size)

  // 1. 半透明暗色圆形底板
  ctx.beginPath()
  ctx.arc(cx, cy, size / 2, 0, Math.PI * 2)
  ctx.fillStyle = colors.bgCard
  ctx.fill()

  // 2. 边界圆（摇杆物理极限）
  ctx.beginPath()
  ctx.arc(cx, cy, plotRadius, 0, Math.PI * 2)
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1.5
  ctx.stroke()

  // 3. 十字准星（极淡虚线）
  ctx.strokeStyle = colors.cross
  ctx.lineWidth = 1
  ctx.setLineDash([3, 5])
  ctx.beginPath()
  ctx.moveTo(cx - plotRadius * 0.5, cy)
  ctx.lineTo(cx + plotRadius * 0.5, cy)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(cx, cy - plotRadius * 0.5)
  ctx.lineTo(cx, cy + plotRadius * 0.5)
  ctx.stroke()
  ctx.setLineDash([])

  // 4. 渐变消退光点轨迹（oldest → newest）
  if (trailSize > 0) {
    const cap = trailBuffer.length
    const startIdx = (trailHead - trailSize + cap) % cap
    const oneOverSize = 1 / Math.max(trailSize, 1)

    ctx.fillStyle = colors.accent

    for (let i = 0; i < trailSize; i++) {
      const ageRatio = i * oneOverSize          // 0=最旧, 接近1=最新
      const alpha = Math.pow(ageRatio, 1.5) * 0.88
      if (alpha < 0.03) continue               // 跳过几乎不可见的旧点

      const p = trailBuffer[(startIdx + i) % cap]
      const px = cx + p.x * plotRadius
      const py = cy - p.y * plotRadius          // Y 轴翻转

      const dotSize = 1.0 + ageRatio * 2.5     // 1px(旧) → 3.5px(新)

      ctx.globalAlpha = alpha
      ctx.fillRect(
        Math.floor(px) - dotSize * 0.5,
        Math.floor(py) - dotSize * 0.5,
        dotSize, dotSize
      )
    }
    ctx.globalAlpha = 1
  }

  // 5. 当前位置发光效果（最新点）
  if (trailSize > 0) {
    const cap = trailBuffer.length
    const latest = trailBuffer[(trailHead - 1 + cap) % cap]
    const lx = cx + latest.x * plotRadius
    const ly = cy - latest.y * plotRadius

    // 外光晕（蓝）
    ctx.globalAlpha = 0.20
    ctx.beginPath()
    ctx.arc(lx, ly, 10, 0, Math.PI * 2)
    ctx.fillStyle = colors.accent
    ctx.fill()

    // 中光晕（亮蓝）
    ctx.globalAlpha = 0.50
    ctx.beginPath()
    ctx.arc(lx, ly, 6.5, 0, Math.PI * 2)
    ctx.fillStyle = 'rgba(150, 200, 255, 1)'
    ctx.fill()

    // 实心白点
    ctx.globalAlpha = 1
    ctx.beginPath()
    ctx.arc(lx, ly, 3.5, 0, Math.PI * 2)
    ctx.fillStyle = 'white'
    ctx.fill()
  }

  animFrameId = requestAnimationFrame(drawFrame)
}

// ─── 响应数据批量写入缓冲区（与 StickPlot 相同模式）─────────────────
watch(() => props.points, (newPoints) => {
  if (!newPoints || newPoints.length === 0) return
  const cap = props.maxPoints
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
}, { deep: false })

// 外部重置信号（设备切换时清空轨迹）
watch(() => props.resetSignal, () => { clearTrail() })

// maxPoints 变化时重建缓冲区，保留最新点
watch(() => props.maxPoints, (newLimit) => {
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
})

// isActive 控制 rAF 暂停/继续
watch(() => props.isActive, (active) => {
  if (active) {
    if (!animFrameId) animFrameId = requestAnimationFrame(drawFrame)
  } else {
    if (animFrameId) { cancelAnimationFrame(animFrameId); animFrameId = null }
  }
})

let observer = null

onMounted(async () => {
  await nextTick()
  clearTrail()
  initCanvas()
  animFrameId = requestAnimationFrame(drawFrame)
  window.addEventListener('resize', initCanvas)

  // 监听主题切换（data-theme 属性变化）
  observer = new MutationObserver((mutations) => {
    mutations.forEach((m) => {
      if (m.type === 'attributes' &&
          (m.attributeName === 'data-theme' || m.attributeName === 'class')) {
        updateColors()
      }
    })
  })
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme', 'class'],
  })
})

onUnmounted(() => {
  if (animFrameId) cancelAnimationFrame(animFrameId)
  window.removeEventListener('resize', initCanvas)
  if (observer) observer.disconnect()
})
</script>

<style scoped>
.stick-overlay-wrap {
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1;
  border-radius: 50%;
  overflow: hidden;
}

canvas {
  width: 100%;
  height: 100%;
  display: block;
}

.stick-label {
  position: absolute;
  bottom: 14%;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.65em;
  font-weight: 700;
  letter-spacing: 0.15em;
  color: rgba(255, 255, 255, 0.28);
  pointer-events: none;
  user-select: none;
}
</style>
