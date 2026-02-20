/**
 * ControllerMeta - Analysis Algorithms
 * 用于分析手柄摇杆精度的统计算法集
 */

/**
 * 回中测试 (Centering Test)
 * 采集摇杆静止时的坐标，计算与 (0,0) 的平均偏差距离
 * @param {Array<{x: number, y: number}>} samples - 静止时采样的坐标点
 * @returns {{ avgDistance: number, maxDistance: number, stdDev: number }}
 */
export function centeringTest(samples) {
  if (!samples || samples.length === 0) return { avgDistance: 0, maxDistance: 0, stdDev: 0 }

  const distances = samples.map(s => Math.sqrt(s.x * s.x + s.y * s.y))
  const avgDistance = distances.reduce((a, b) => a + b, 0) / distances.length
  const maxDistance = Math.max(...distances)
  const variance = distances.reduce((sum, d) => sum + (d - avgDistance) ** 2, 0) / distances.length
  const stdDev = Math.sqrt(variance)

  return { avgDistance, maxDistance, stdDev }
}

/**
 * 圆度错误率 (Circularity Error)
 * 计算摇杆推至边缘时与标准圆的偏差
 * @param {Array<{x: number, y: number}>} edgeSamples - 边缘采样点
 * @param {number} expectedRadius - 预期半径 (默认 1.0)
 * @returns {{ avgError: number, maxError: number, errorPercent: number }}
 */
export function circularityError(edgeSamples, expectedRadius = 1.0) {
  if (!edgeSamples || edgeSamples.length === 0) return { avgError: 0, maxError: 0, errorPercent: 0 }

  const radii = edgeSamples.map(s => Math.sqrt(s.x * s.x + s.y * s.y))
  const errors = radii.map(r => Math.abs(r - expectedRadius))
  const avgError = errors.reduce((a, b) => a + b, 0) / errors.length
  const maxError = Math.max(...errors)
  const errorPercent = (avgError / expectedRadius) * 100

  return { avgError, maxError, errorPercent }
}

/**
 * 分辨率/位深检测 (Resolution Detection)
 * 追踪轴值变化的最小非零步进，推算有效位深
 * @param {number[]} axisValues - 一系列轴值 (归一化 -1 ~ 1)
 * @returns {{ minStep: number, estimatedBits: number, stepCount: number }}
 */
export function detectResolution(axisValues) {
  if (!axisValues || axisValues.length < 2) return { minStep: 0, estimatedBits: 0, stepCount: 0 }

  let minStep = Infinity
  let stepCount = 0

  for (let i = 1; i < axisValues.length; i++) {
    const diff = Math.abs(axisValues[i] - axisValues[i - 1])
    if (diff > 1e-7) { // ignore zero changes
      stepCount++
      if (diff < minStep) {
        minStep = diff
      }
    }
  }

  if (minStep === Infinity) minStep = 0

  // Estimate bit depth: 2^bits ≈ range(2.0) / minStep
  let estimatedBits = 0
  if (minStep > 0) {
    estimatedBits = Math.round(Math.log2(2.0 / minStep))
  }

  return { minStep, estimatedBits, stepCount }
}

/**
 * 步进检测 (Step Detection)
 * 统计所有步进值并返回分布
 * @param {number[]} axisValues
 * @returns {{ steps: Map<number, number>, uniqueSteps: number }}
 */
export function detectSteps(axisValues) {
  const steps = new Map()

  for (let i = 1; i < axisValues.length; i++) {
    const diff = Math.abs(axisValues[i] - axisValues[i - 1])
    if (diff > 1e-7) {
      const rounded = Math.round(diff * 100000) / 100000
      steps.set(rounded, (steps.get(rounded) || 0) + 1)
    }
  }

  return { steps, uniqueSteps: steps.size }
}

/**
 * 死区分析 (Deadzone Analysis)
 * 采集静止态附近所有点的分布范围
 * @param {Array<{x: number, y: number}>} samples
 * @returns {{ radiusMin: number, radiusMax: number, shape: string }}
 */
export function deadzoneAnalysis(samples) {
  if (!samples || samples.length === 0) return { radiusMin: 0, radiusMax: 0, shape: 'unknown' }

  const radii = samples.map(s => Math.sqrt(s.x * s.x + s.y * s.y))
  const radiusMin = Math.min(...radii)
  const radiusMax = Math.max(...radii)

  const xRange = Math.max(...samples.map(s => Math.abs(s.x)))
  const yRange = Math.max(...samples.map(s => Math.abs(s.y)))
  const ratio = Math.min(xRange, yRange) / Math.max(xRange, yRange || 1)
  const shape = ratio > 0.85 ? 'circular' : ratio > 0.5 ? 'elliptical' : 'rectangular'

  return { radiusMin, radiusMax, shape }
}
