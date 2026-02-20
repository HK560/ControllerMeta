<template>
  <div class="test-suite">
    <h4 class="text-xs font-bold uppercase tracking-wider text-[var(--cs-text-secondary)] mb-3">{{ $t('test_suite.title') }} {{ $t('test_suite.not_supported') }}</h4>
    
    <div class="space-y-1.5">
      <button 
        v-for="test in tests" :key="test.id"
        @click="runTest(test.id)"
        class="w-full flex items-center justify-between p-2 rounded-lg text-left transition-all border"
        :class="activeTest === test.id 
          ? 'bg-[var(--cs-accent-blue)]/10 border-[var(--cs-accent-blue)] text-[var(--cs-accent-blue)]' 
          : 'bg-[var(--cs-bg-primary)] border-[var(--cs-border)] text-[var(--cs-text-secondary)] hover:border-[var(--cs-accent-blue)]/50 hover:text-[var(--cs-text-primary)]'"
      >
        <div class="flex items-center gap-2">
          <span class="text-sm">{{ test.icon }}</span>
          <div>
            <div class="text-xs font-semibold">{{ $t('test_suite.' + test.id + '_name') }}</div>
            <div class="text-[10px] opacity-70">{{ $t('test_suite.' + test.id + '_desc') }}</div>
          </div>
        </div>
        <span v-if="test.result !== null" class="cs-mono text-[11px]" :class="test.resultColor">
          {{ test.result }}
        </span>
      </button>
    </div>

    <!-- Active test result panel -->
    <div v-if="activeResult" class="mt-3 p-3 rounded-lg bg-[var(--cs-bg-primary)] border border-[var(--cs-border)]">
      <div class="text-[10px] text-[var(--cs-text-secondary)] uppercase mb-1">{{ $t('test_suite.result') }}</div>
      <div class="cs-mono text-sm text-[var(--cs-text-primary)]" v-html="activeResult"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()


const emit = defineEmits(['startTest'])

const activeTest = ref(null)
const activeResult = ref('')

const tests = reactive([
  { 
    id: 'centering', 
    name: 'Centering Test', 
    desc: 'Measure stick return-to-center accuracy',
    icon: '🎯',
    result: null,
    resultColor: ''
  },
  { 
    id: 'resolution', 
    name: 'Resolution Test', 
    desc: 'Detect effective bit-depth',
    icon: '📊',
    result: null,
    resultColor: ''
  },
  { 
    id: 'deadzone', 
    name: 'Deadzone Analysis', 
    desc: 'Map the center deadzone shape',
    icon: '🔲',
    result: null,
    resultColor: ''
  },
])

function runTest(testId) {
  activeTest.value = testId
  activeResult.value = t('test_suite.collecting')
  emit('startTest', testId)
}

function setResult(testId, result, color = 'text-[var(--cs-text-primary)]') {
  const test = tests.find(t => t.id === testId)
  if (test) {
    test.result = result
    test.resultColor = color
  }
  activeResult.value = result
}

defineExpose({ setResult })
</script>
