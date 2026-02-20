<template>
  <div class="h-full flex flex-col font-mono text-xs overflow-hidden">
    <!-- Header -->
    <div class="flex items-center justify-between mb-2 shrink-0">
      <h4 class="text-xs font-bold uppercase tracking-wider text-[var(--cs-text-secondary)] flex items-center gap-2">
        <div class="w-2 h-2 rounded-full transition-shadow duration-300"
             :class="connected ? 'bg-[var(--cs-accent-green)] shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-[var(--cs-accent-red)]'"></div>
        <span>{{ $t('device_inspector.title') }}</span>
        <span v-if="devices.length > 0" class="px-1.5 py-0.5 rounded-full bg-[var(--cs-bg-primary)] border border-[var(--cs-border)] text-[10px] text-[var(--cs-text-secondary)]">
            {{ devices.length }}
        </span>
      </h4>
      <div class="flex items-center gap-1">
        <!-- Copy Debug Report button -->
        <button
          v-if="connected"
          @click="fetchAndCopyDebugReport"
          class="p-1 hover:text-[var(--cs-accent-orange)] transition-colors opacity-70 hover:opacity-100"
          :title="$t('device_inspector.copy_report')"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </button>
        <button
          @click="refreshInfo"
          class="p-1 hover:text-[var(--cs-accent-blue)] transition-colors opacity-70 hover:opacity-100"
          :title="$t('common.reset')"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Scrollable Content -->
    <div class="flex-1 overflow-hidden flex flex-col relative rounded-lg border border-[var(--cs-border)] bg-[var(--cs-bg-primary)]/30">
      
      <div v-if="devices.length === 0" class="absolute inset-0 flex flex-col items-center justify-center opacity-50 z-10">
        <div class="animate-spin mb-2 text-2xl">⟳</div>
        <span>{{ $t('device_inspector.waiting') }}</span>
      </div>

      <div v-else class="flex flex-col h-full">

          <!-- Current Device Data -->
          <div class="flex-1 flex flex-col overflow-hidden">
             <!-- Identity Section (Always Visible) -->
            <div class="p-3 pb-2 shrink-0">
                <div class="flex items-start justify-between mb-3">
                    <div class="overflow-hidden mr-2">
                        <div class="font-bold truncate text-sm text-[var(--cs-text-primary)]" :title="currentDevice.productName">{{ currentDevice.productName }}</div>
                    </div>
                    <div class="shrink-0 px-2 py-0.5 rounded bg-[var(--cs-bg-card)] border border-[var(--cs-border)] text-[var(--cs-accent-blue)] text-[10px]">
                        {{ currentDevice.protocol }}
                    </div>
                </div>

                <!-- IDs -->
                <div class="grid grid-cols-2 gap-2 p-2 rounded bg-[var(--cs-bg-card)] border border-[var(--cs-border)]">
                    <div>
                        <div class="text-[var(--cs-text-secondary)] text-[10px] uppercase">{{ $t('device_inspector.vid') }}</div>
                        <div class="text-[var(--cs-accent-orange)] font-bold font-mono">0x{{ currentDevice.vid?.toString(16).toUpperCase().padStart(4, '0') }}</div>
                    </div>
                    <div>
                        <div class="text-[var(--cs-text-secondary)] text-[10px] uppercase">{{ $t('device_inspector.pid') }}</div>
                        <div class="text-[var(--cs-accent-orange)] font-bold font-mono">0x{{ currentDevice.pid?.toString(16).toUpperCase().padStart(4, '0') }}</div>
                    </div>
                </div>
            </div>

            <!-- Custom Tabs -->
            <div class="flex px-4 gap-4 border-b border-[var(--cs-border)] text-[11px] font-bold text-[var(--cs-text-secondary)] shrink-0">
                <button
                    @click="activeTab = 'details'"
                    class="pb-2 border-b-2 transition-colors hover:text-[var(--cs-text-primary)]"
                    :class="activeTab === 'details' ? 'border-[var(--cs-accent-blue)] text-[var(--cs-text-primary)]' : 'border-transparent'"
                >
                    DETAILS
                </button>
                <button
                    @click="activeTab = 'raw'"
                    class="pb-2 border-b-2 transition-colors hover:text-[var(--cs-text-primary)]"
                    :class="activeTab === 'raw' ? 'border-[var(--cs-accent-blue)] text-[var(--cs-text-primary)]' : 'border-transparent'"
                >
                    RAW
                </button>
            </div>

            <!-- Tab Content -->
            <div class="flex-1 overflow-y-auto p-3 custom-scrollbar">
                
                <!-- Tab: Details -->
                <div v-if="activeTab === 'details'" class="space-y-4">
                    <!-- HID Specifics -->
                    <div v-if="currentDevice.hidInfo" class="space-y-2">
                        <div class="text-[var(--cs-text-secondary)] text-[10px] uppercase border-b border-[var(--cs-border)] pb-1">{{ $t('device_inspector.hid_descriptors') }}</div>
                        
                        <div class="grid grid-cols-2 gap-x-4 gap-y-2 text-[11px]">
                            <div class="flex justify-between">
                                <span class="text-[var(--cs-text-secondary)]">{{ $t('device_inspector.usage_page') }}</span>
                                <span class="text-[var(--cs-text-primary)]">0x{{ currentDevice.hidInfo.usagePage?.toString(16).toUpperCase().padStart(4, '0') }}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-[var(--cs-text-secondary)]">{{ $t('device_inspector.usage') }}</span>
                                <span class="text-[var(--cs-text-primary)]">0x{{ currentDevice.hidInfo.usage?.toString(16).toUpperCase().padStart(4, '0') }}</span>
                            </div>
                            
                            <div class="col-span-2 h-px bg-[var(--cs-border)] my-0.5"></div>

                            <div class="flex justify-between">
                                <span class="text-[var(--cs-text-secondary)]">{{ $t('device_inspector.input_report') }}</span>
                                <span class="text-[var(--cs-text-primary)]">{{ currentDevice.hidInfo.inputReportByteLength }} {{ $t('device_inspector.bytes') }}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-[var(--cs-text-secondary)]">{{ $t('device_inspector.output_report') }}</span>
                                <span class="text-[var(--cs-text-primary)]">{{ currentDevice.hidInfo.outputReportByteLength }} {{ $t('device_inspector.bytes') }}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-[var(--cs-text-secondary)]">{{ $t('device_inspector.feature_report') }}</span>
                                <span class="text-[var(--cs-text-primary)]">{{ currentDevice.hidInfo.featureReportByteLength }} {{ $t('device_inspector.bytes') }}</span>
                            </div>

                            <div class="col-span-2 h-px bg-[var(--cs-border)] my-0.5"></div>
                            
                            <div class="flex justify-between">
                                <span class="text-[var(--cs-text-secondary)]">{{ $t('device_inspector.input_buttons') }}</span>
                                <span class="text-[var(--cs-text-primary)]">{{ currentDevice.hidInfo.numberInputButtonCaps }} {{ $t('device_inspector.groups') }}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-[var(--cs-text-secondary)]">{{ $t('device_inspector.input_values') }}</span>
                                <span class="text-[var(--cs-text-primary)]">{{ currentDevice.hidInfo.numberInputValueCaps }} {{ $t('device_inspector.groups') }}</span>
                            </div>
                        </div>
                    </div>

                    <!-- XInput Specifics -->
                    <div v-if="currentDevice.xinputInfo" class="space-y-2">
                        <div class="text-[var(--cs-text-secondary)] text-[10px] uppercase border-b border-[var(--cs-border)] pb-1">{{ $t('device_inspector.xinput_caps') }}</div>
                        <div class="grid grid-cols-2 gap-x-4 gap-y-2 text-[11px]">
                            <div class="flex justify-between">
                                <span class="text-[var(--cs-text-secondary)]">{{ $t('device_inspector.user_index') }}</span>
                                <span class="text-[var(--cs-text-primary)]">{{ currentDevice.xinputInfo.userIndex }}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-[var(--cs-text-secondary)]">{{ $t('device_inspector.subtype') }}</span>
                                <span class="text-[var(--cs-text-primary)]">{{ currentDevice.xinputInfo.subType }}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-[var(--cs-text-secondary)]">{{ $t('device_inspector.flags') }}</span>
                                <span class="text-[var(--cs-text-primary)]">0x{{ currentDevice.xinputInfo.flags?.toString(16).toUpperCase() }}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-[var(--cs-text-secondary)]">{{ $t('device_inspector.vibration') }}</span>
                                <span :class="currentDevice.xinputInfo.caps_vibration === 'true' ? 'text-[var(--cs-accent-green)]' : 'text-[var(--cs-accent-red)]'">
                                    {{ currentDevice.xinputInfo.caps_vibration === 'true' ? $t('device_inspector.supported') : $t('device_inspector.none') }}
                                </span>
                            </div>
                        </div>
                    </div>
                    
                    <!-- DInput Specifics -->
                    <div v-if="currentDevice.dinputInfo" class="space-y-2">
                        <div class="text-[var(--cs-text-secondary)] text-[10px] uppercase border-b border-[var(--cs-border)] pb-1">{{ $t('device_inspector.dinput_guids') }}</div>
                        <div class="space-y-2 break-all text-[11px]">
                            <div>
                                <div class="text-[var(--cs-text-secondary)] text-[10px]">{{ $t('device_inspector.instance_guid') }}</div>
                                <div class="text-[var(--cs-text-primary)] opacity-80 select-all">{{ currentDevice.dinputInfo.instanceGuid }}</div>
                            </div>
                            <div>
                                <div class="text-[var(--cs-text-secondary)] text-[10px]">{{ $t('device_inspector.product_guid') }}</div>
                                <div class="text-[var(--cs-text-primary)] opacity-80 select-all">{{ currentDevice.dinputInfo.productGuid }}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Tab: Raw -->
                <div v-if="activeTab === 'raw'" class="h-full">
                    <div class="p-3 bg-[var(--cs-bg-primary)] rounded-lg font-mono text-[10px] text-[var(--cs-text-primary)] border border-[var(--cs-border)] h-full overflow-y-auto">
                        <div class="opacity-50 mb-2 border-b border-[var(--cs-border)] pb-1"># {{ $t('device_inspector.raw_status') }}</div>
                        <div class="space-y-1">
                            <div class="flex gap-2">
                                <span class="opacity-70">></span>
                                <span class="text-[var(--cs-accent-green)]">{{ $t('device_inspector.connected') }}</span>
                            </div>
                            <div class="flex gap-2">
                                <span class="opacity-70">></span>
                                <span class="text-[var(--cs-accent-blue)]">{{ $t('device_inspector.polling_rate') }}: {{ runningPollingRate }} Hz</span>
                            </div>
                            <br>
                            <div class="opacity-50 text-[9px]">
                                // PROT: {{ currentDevice.protocol }}
                                <br>
                                // {{ new Date().toLocaleTimeString() }}
                            </div>
                        </div>
                    </div>
                </div>

            </div>
          </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, inject } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const toast = inject('toast')

const activeTab = ref('details')
const devices = ref([])
const selectedDeviceIndex = ref(0)
const connected = ref(false)
const runningPollingRate = ref(0)

// Pending debug report (populated on response, then immediately consumed)
let pendingDebugResolve = null

const currentDevice = computed(() => {
    return devices.value[selectedDeviceIndex.value] || null
})

function formatDebugReport(r) {
    const lines = []
    const hex = (n, pad = 4) => '0x' + n.toString(16).toUpperCase().padStart(pad, '0')

    lines.push('=== ControllerMeta Debug Report ===')
    lines.push(`Generated: ${new Date().toISOString()}`)
    lines.push('')
    lines.push('[Device Identity]')
    lines.push(`VID: ${r.vid_hex}  PID: ${r.pid_hex}`)
    lines.push(`Matched Profile: ${r.matchedProfile}`)
    lines.push(`Match Mode: ${r.matchByAxisIndex ? 'Index-based (SDL)' : 'Usage-based'}`)
    lines.push(`Hat Base: ${r.hatBase}`)
    lines.push(`SDL Mapping: ${r.sdlMapping || '(none)'}`)
    lines.push(`Device Path: ${r.devicePath}`)
    lines.push('')
    lines.push('[HID Capabilities]')
    const h = r.hidCaps
    lines.push(`Usage Page: ${hex(h.usagePage)}  Usage: ${hex(h.usage)}`)
    lines.push(`Input Report: ${h.inputReportByteLength}B  Output: ${h.outputReportByteLength}B  Feature: ${h.featureReportByteLength}B`)
    lines.push(`Button Groups: ${h.numberInputButtonCaps}  Value Groups: ${h.numberInputValueCaps}  Link Collections: ${h.numberLinkCollectionNodes}`)
    lines.push('')
    lines.push('[Value Caps (Axes/Values)]')
    for (let i = 0; i < r.valueCaps.length; i++) {
        const c = r.valueCaps[i]
        const usageStr = c.isRange ? `${hex(c.usageMin)}-${hex(c.usageMax)}` : hex(c.usageMin)
        lines.push(`#${i}  Page:${hex(c.usagePage)} Usage:${usageStr}  LogMin:${c.logMin}  LogMax:${c.logMax}  Bits:${c.bitSize}  Count:${c.reportCount}`)
    }
    lines.push('')
    lines.push('[Button Caps]')
    for (let i = 0; i < r.buttonCaps.length; i++) {
        const c = r.buttonCaps[i]
        lines.push(`#${i}  Page:${hex(c.usagePage)} Usage:${hex(c.usageMin)}-${hex(c.usageMax)}  Count:${c.count}`)
    }
    lines.push('')
    lines.push('[Profile Axis Mapping]')
    lines.push(`Mode: ${r.matchByAxisIndex ? 'Index' : 'Usage'}`)
    for (const am of r.profileAxes) {
        const src = r.matchByAxisIndex ? `Index:${am.usage}` : `Usage:${hex(am.usage)}`
        lines.push(`  ${src} → ${am.role}${am.inverted ? ' (inverted)' : ''}`)
    }
    lines.push('')
    lines.push('[Current Axis Snapshot]')
    for (let i = 0; i < r.currentAxes.length; i++) {
        const ax = r.currentAxes[i]
        lines.push(`#${i}  Page:${hex(ax.page)} Usage:${hex(ax.usage)}  Raw:${ax.raw}  Min:${ax.min}  Max:${ax.max}  Bits:${ax.bits}  Norm:${ax.norm.toFixed(4)}`)
    }
    return lines.join('\n')
}

function handleMessage(event) {
    const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data

    if (data.type === 'device_detail') {
        if (Array.isArray(data.data)) {
            devices.value = data.data
        } else {
            devices.value = [data.data]
        }
        if (devices.value.length > 0) connected.value = true
    } else if (data.type === 'gamepad_data') {
        connected.value = data.connected !== false
        if (data.pollingRate) runningPollingRate.value = data.pollingRate.toFixed(1)
    } else if (data.type === 'debug_report') {
        if (pendingDebugResolve) {
            pendingDebugResolve(data.data)
            pendingDebugResolve = null
        }
    }
}

function refreshInfo() {
    if (window.chrome?.webview) {
        window.chrome.webview.postMessage(JSON.stringify({ type: 'get_device_detail' }))
    } else {
        setTimeout(() => {
            devices.value = [{
                productName: "Mock Controller (HID)",
                vid: 0x1234, pid: 0x5678,
                protocol: "HID",
                hidInfo: { usagePage: 1, usage: 5, inputReportByteLength: 64, outputReportByteLength: 32, featureReportByteLength: 0, numberInputButtonCaps: 12, numberInputValueCaps: 6 }
            }]
            connected.value = true
        }, 200)
    }
}

async function fetchAndCopyDebugReport() {
    if (!window.chrome?.webview) return
    window.chrome.webview.postMessage(JSON.stringify({ type: 'get_debug_report' }))
    const data = await new Promise(resolve => { pendingDebugResolve = resolve })
    const text = formatDebugReport(data)
    try {
        await navigator.clipboard.writeText(text)
        toast?.show(t('device_inspector.copied'), 'success')
    } catch {
        toast?.show(t('device_inspector.copy_failed'), 'error')
    }
}

onMounted(() => {
    if (window.chrome?.webview) {
        window.chrome.webview.addEventListener('message', handleMessage)
        refreshInfo()
        const interval = setInterval(refreshInfo, 2000)
        onUnmounted(() => clearInterval(interval))
    } else {
        refreshInfo()
    }
})

onUnmounted(() => {
    if (window.chrome?.webview) {
        window.chrome.webview.removeEventListener('message', handleMessage)
    }
})
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent; 
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: var(--cs-border); 
  border-radius: 2px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: var(--cs-text-secondary); 
}

.custom-scrollbar-x::-webkit-scrollbar {
  height: 2px;
}
.custom-scrollbar-x::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar-x::-webkit-scrollbar-thumb {
  background: var(--cs-border);
  border-radius: 2px;
}
</style>
