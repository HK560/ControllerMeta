<template>
  <div class="h-full flex flex-col p-6 gap-6 max-w-4xl mx-auto">
    <!-- Page title -->
    <h1 class="text-2xl font-bold flex items-center gap-2">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-(--cs-accent-blue)" fill="none" viewBox="0 0 24 24"
        stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
      {{ $t('settings') }}
    </h1>

    <div class="flex flex-col gap-6 pb-4">
      <!-- ── Language ─────────────────────────────────────────── -->
      <section class="cs-card flex items-center justify-between">
        <h3 class="text-base font-semibold text-(--cs-text-primary)">{{ $t('language') }}</h3>
        <div class="flex bg-(--cs-bg-primary) p-1 rounded-lg border border-(--cs-border)">
          <button @click="setLocale('en')" class="px-4 py-2 rounded-md text-sm font-medium transition-all"
            :class="$i18n.locale === 'en' ? 'bg-(--cs-accent-blue) text-white shadow-sm' : 'text-(--cs-text-secondary) hover:text-(--cs-text-primary)'">English</button>
          <button @click="setLocale('zh')" class="px-4 py-2 rounded-md text-sm font-medium transition-all"
            :class="$i18n.locale === 'zh' ? 'bg-(--cs-accent-blue) text-white shadow-sm' : 'text-(--cs-text-secondary) hover:text-(--cs-text-primary)'">中文</button>
        </div>
      </section>

      <!-- ── UI Theme ──────────────────────────────────────────── -->
      <section class="cs-card flex items-center justify-between">
        <h3 class="text-base font-semibold text-(--cs-text-primary)">{{ $t('settings_theme') }}</h3>
        <div class="flex bg-(--cs-bg-primary) p-1 rounded-lg border border-(--cs-border)">
          <button @click="setTheme('dark')"
            class="px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2"
            :class="currentTheme === 'dark' ? 'bg-(--cs-accent-blue) text-white shadow-sm' : 'text-(--cs-text-secondary) hover:text-(--cs-text-primary)'">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
            {{ $t('theme_dark') }}
          </button>
          <button @click="setTheme('light')"
            class="px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2"
            :class="currentTheme === 'light' ? 'bg-(--cs-accent-blue) text-white shadow-sm' : 'text-(--cs-text-secondary) hover:text-(--cs-text-primary)'">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707" />
            </svg>
            {{ $t('theme_light') }}
          </button>
        </div>
      </section>

      <!-- ── Background Image ──────────────────────────────────── -->
      <section class="cs-card flex flex-col gap-5">
        <h3 class="text-base font-semibold text-(--cs-text-primary)">{{ $t('theme.bg_title') }}</h3>

        <!-- Upload area -->
        <div class="flex items-start gap-4">
          <!-- Preview thumbnail -->
          <div
            class="relative w-32 h-20 rounded-lg border-2 border-dashed border-(--cs-border) overflow-hidden shrink-0 flex items-center justify-center bg-(--cs-bg-primary) cursor-pointer hover:border-(--cs-accent-blue) transition-colors group"
            @click="triggerUpload">
            <img v-if="bgImage" :src="bgImage" class="absolute inset-0 w-full h-full object-cover" />
            <div v-else
              class="flex flex-col items-center gap-1 text-(--cs-text-secondary) group-hover:text-(--cs-accent-blue) transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span class="text-[10px]">{{ $t('theme.bg_upload') }}</span>
            </div>
            <!-- Hover overlay when image exists -->
            <div v-if="bgImage"
              class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span class="text-white text-xs">{{ $t('theme.bg_change') }}</span>
            </div>
          </div>

          <!-- Controls beside preview -->
          <div class="flex flex-col gap-2 flex-1">
            <button @click="triggerUpload"
              class="px-3 py-1.5 text-sm rounded-lg bg-(--cs-accent-blue)/15 text-(--cs-accent-blue) border border-(--cs-accent-blue)/30 hover:bg-(--cs-accent-blue)/25 transition-colors w-fit">
              {{ bgImage ? $t('theme.bg_change') : $t('theme.bg_upload') }}
            </button>
            <button v-if="bgImage" @click="removeBg"
              class="px-3 py-1.5 text-sm rounded-lg bg-(--cs-accent-red)/10 text-(--cs-accent-red) border border-(--cs-accent-red)/25 hover:bg-(--cs-accent-red)/20 transition-colors w-fit">
              {{ $t('theme.bg_remove') }}
            </button>
            <p class="text-xs text-(--cs-text-secondary) mt-1">{{ $t('theme.bg_hint') }}</p>
          </div>
        </div>

        <!-- Hidden file input -->
        <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="onFileChange" />

        <!-- Fit mode -->
        <div class="flex flex-col gap-2">
          <label class="text-sm text-(--cs-text-secondary)">{{ $t('theme.bg_fit') }}</label>
          <div class="grid grid-cols-4 gap-2">
            <button v-for="fit in fitOptions" :key="fit.value" @click="setBgFit(fit.value)"
              class="flex flex-col items-center gap-1.5 p-2.5 rounded-lg border text-xs font-medium transition-all"
              :class="bgFit === fit.value
                ? 'border-(--cs-accent-blue) bg-(--cs-accent-blue)/10 text-(--cs-accent-blue)'
                : 'border-(--cs-border) text-(--cs-text-secondary) hover:border-(--cs-accent-blue)/50 hover:text-(--cs-text-primary)'">
              <!-- Fit icon -->
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                stroke="currentColor" stroke-width="1.5">
                <path v-if="fit.value === 'cover'" stroke-linecap="round" stroke-linejoin="round"
                  d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                <path v-if="fit.value === 'contain'" stroke-linecap="round" stroke-linejoin="round"
                  d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25" />
                <path v-if="fit.value === 'center'" stroke-linecap="round" stroke-linejoin="round"
                  d="M12 4v16m-8-8h16" />
                <path v-if="fit.value === 'tile'" stroke-linecap="round" stroke-linejoin="round"
                  d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
              </svg>
              {{ $t(`theme.fit_${fit.value}`) }}
            </button>
          </div>
        </div>

        <!-- Brightness -->
        <div class="flex flex-col gap-2">
          <div class="flex items-center justify-between">
            <label class="text-sm text-(--cs-text-secondary)">{{ $t('theme.bg_brightness') }}</label>
            <span class="text-sm cs-mono text-(--cs-text-primary)">{{ Math.round(bgBrightness * 100) }}%</span>
          </div>
          <div class="flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-(--cs-text-secondary) shrink-0" fill="none"
              viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
            <input type="range" min="0.1" max="1.5" step="0.05" :value="bgBrightness"
              @input="setBgBrightness(parseFloat($event.target.value))" class="cs-slider flex-1" />
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-(--cs-text-secondary) shrink-0" fill="none"
              viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707" />
            </svg>
          </div>
        </div>

        <!-- Blur -->
        <div class="flex flex-col gap-2">
          <div class="flex items-center justify-between">
            <label class="text-sm text-(--cs-text-secondary)">{{ $t('theme.bg_blur') }}</label>
            <span class="text-sm cs-mono text-(--cs-text-primary)">{{ bgBlur }}px</span>
          </div>
          <div class="flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-(--cs-text-secondary) shrink-0" fill="none"
              viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <input type="range" min="0" max="20" step="0.5" :value="bgBlur"
              @input="setBgBlur(parseFloat($event.target.value))" class="cs-slider flex-1" />
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-(--cs-text-secondary) shrink-0" fill="none"
              viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </div>
        </div>
      </section>

      <!-- ── Panel Style ───────────────────────────────────────── -->
      <section class="cs-card flex flex-col gap-5">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-base font-semibold text-(--cs-text-primary)">{{ $t('theme.glass_title') }}</h3>
            <p class="text-xs text-(--cs-text-secondary) mt-0.5">{{ $t('theme.glass_desc') }}</p>
          </div>
          <!-- Toggle switch -->
          <button @click="setGlassEnabled(!glassEnabled)"
            class="relative w-12 h-6 rounded-full transition-colors duration-200 shrink-0"
            :class="glassEnabled && bgImage ? 'bg-(--cs-accent-blue)' : 'bg-(--cs-border)'" :disabled="!bgImage"
            :title="!bgImage ? $t('theme.glass_needs_bg') : ''">
            <span
              class="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200"
              :class="glassEnabled && bgImage ? 'translate-x-6' : 'translate-x-0'"></span>
          </button>
        </div>

        <!-- No bg image warning -->
        <p v-if="!bgImage" class="text-xs text-(--cs-accent-orange) flex items-center gap-1.5">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {{ $t('theme.glass_needs_bg') }}
        </p>

        <!-- Glass sub-controls (only when enabled + bg exists) -->
        <template v-if="glassEnabled && bgImage">
          <!-- Panel opacity -->
          <div class="flex flex-col gap-2">
            <div class="flex items-center justify-between">
              <label class="text-sm text-(--cs-text-secondary)">{{ $t('theme.glass_opacity') }}</label>
              <span class="text-sm cs-mono text-(--cs-text-primary)">{{ Math.round(glassOpacity * 100) }}%</span>
            </div>
            <input type="range" min="0.1" max="0.98" step="0.01" :value="glassOpacity"
              @input="setGlassOpacity(parseFloat($event.target.value))" class="cs-slider" />
          </div>

          <!-- Panel blur -->
          <div class="flex flex-col gap-2">
            <div class="flex items-center justify-between">
              <label class="text-sm text-(--cs-text-secondary)">{{ $t('theme.glass_blur') }}</label>
              <span class="text-sm cs-mono text-(--cs-text-primary)">{{ glassBlur }}px</span>
            </div>
            <input type="range" min="0" max="30" step="1" :value="glassBlur"
              @input="setGlassBlur(parseFloat($event.target.value))" class="cs-slider" />
          </div>

          <!-- Live preview hint -->
          <div
            class="rounded-lg border border-(--cs-accent-blue)/20 bg-(--cs-accent-blue)/5 px-3 py-2 text-xs text-(--cs-text-secondary) flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-(--cs-accent-blue) shrink-0" fill="none"
              viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            {{ $t('theme.glass_preview_hint') }}
          </div>
        </template>
      </section>

      <!-- ── OBS Overlay ─────────────────────────────────────────── -->
      <section class="cs-card flex flex-col gap-4">
        <div class="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-(--cs-accent-blue) shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.89L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          <h3 class="text-base font-semibold text-(--cs-text-primary)">{{ $t('overlay.title') }}</h3>
        </div>

        <!-- Enable toggle -->
        <div class="flex items-start justify-between gap-4">
          <div>
            <p class="text-sm font-medium text-(--cs-text-primary)">{{ $t('overlay.enable') }}</p>
            <p class="text-xs text-(--cs-text-secondary) mt-0.5">{{ $t('overlay.enable_hint') }}</p>
          </div>
          <button @click="setOverlayEnabled(!overlayEnabled)"
            class="relative w-12 h-6 rounded-full transition-colors duration-200 shrink-0 mt-0.5"
            :class="overlayEnabled ? 'bg-(--cs-accent-blue)' : 'bg-(--cs-border)'">
            <span
              class="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200"
              :class="overlayEnabled ? 'translate-x-6' : 'translate-x-0'"></span>
          </button>
        </div>

        <!-- 面板列表（仅在已启用时显示） -->
        <template v-if="overlayEnabled">
          <div v-if="overlayPort > 0" class="flex flex-col gap-2">
            <p class="text-xs font-medium text-(--cs-text-secondary)">{{ $t('overlay.panels_title') }}</p>

            <!-- 每个覆盖层面板占一行，未来新增面板只需在 overlayPanels 数组追加即可 -->
            <div
              v-for="panel in overlayPanels"
              :key="panel.id"
              class="flex items-center gap-3 rounded-lg border border-(--cs-border) bg-(--cs-bg-primary) px-3 py-2.5"
            >
              <!-- 名称 + 描述 -->
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-(--cs-text-primary)">{{ $t(`overlay.panel_${panel.id}_title`) }}</p>
                <p class="text-xs text-(--cs-text-secondary) mt-0.5">{{ $t(`overlay.panel_${panel.id}_desc`) }}</p>
              </div>
              <!-- URL（中等及以上宽度才显示） -->
              <code class="hidden md:block text-xs cs-mono text-(--cs-accent-blue) truncate max-w-[220px] select-all shrink-0">
                {{ panel.url }}
              </code>
              <!-- 复制按钮 -->
              <button
                @click="copyPanelUrl(panel)"
                class="shrink-0 px-3 py-1.5 text-xs rounded-lg border transition-colors"
                :class="copiedPanelId === panel.id
                  ? 'bg-(--cs-accent-green)/15 text-(--cs-accent-green) border-(--cs-accent-green)/40'
                  : 'bg-(--cs-bg-card) text-(--cs-text-secondary) border-(--cs-border) hover:text-(--cs-accent-blue) hover:border-(--cs-accent-blue)/50'"
              >
                {{ copiedPanelId === panel.id ? $t('overlay.copied') : $t('overlay.copy_url') }}
              </button>
            </div>
          </div>
          <p v-else class="text-xs text-(--cs-accent-orange)">{{ $t('overlay.server_off') }}</p>

          <!-- OBS 使用说明 -->
          <p class="text-xs text-(--cs-text-secondary) leading-relaxed">{{ $t('overlay.instructions') }}</p>
        </template>
      </section>

      <!-- ── Aggressive Push Mode ──────────────────────────────── -->
      <section class="cs-card flex flex-col gap-4">
        <div>
          <h3 class="text-base font-semibold text-(--cs-text-primary)">{{ $t('push_interval.title') }}</h3>
          <p class="text-xs text-(--cs-text-secondary) mt-0.5">{{ $t('push_interval.desc') }}</p>
        </div>

        <div class="flex bg-(--cs-bg-primary) p-1 rounded-lg border border-(--cs-border) gap-0.5">
          <button
            v-for="ms in PUSH_INTERVAL_OPTIONS"
            :key="ms"
            @click="setPushInterval(ms)"
            class="flex-1 py-2 rounded-md text-sm font-medium transition-all"
            :class="pushIntervalMs === ms
              ? 'bg-(--cs-accent-blue) text-white shadow-sm'
              : 'text-(--cs-text-secondary) hover:text-(--cs-text-primary)'"
          >
            {{ ms === 16 ? $t('push_interval.off_label') : ms === 0 ? $t('push_interval.realtime_label') : $t('push_interval.label_ms', { n: ms }) }}
          </button>
        </div>

        <div
          v-if="pushIntervalMs < 8 && pushIntervalMs !== 0"
          class="flex items-start gap-2 rounded-lg border border-(--cs-accent-orange)/30 bg-(--cs-accent-orange)/10 px-3 py-2.5"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-(--cs-accent-orange) shrink-0 mt-0.5"
               fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
          </svg>
          <p class="text-xs text-(--cs-accent-orange) leading-relaxed">{{ $t('push_interval.warning') }}</p>
        </div>

        <div
          v-if="pushIntervalMs === 0"
          class="flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2.5"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-red-400 shrink-0 mt-0.5"
               fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
          </svg>
          <p class="text-xs text-red-400 leading-relaxed">{{ $t('push_interval.warning_realtime') }}</p>
        </div>
      </section>

      <!-- ── Polling Rate Sample Window ────────────────────────── -->
      <section class="cs-card flex flex-col gap-4">
        <div>
          <h3 class="text-base font-semibold text-(--cs-text-primary)">{{ $t('polling_window.title') }}</h3>
          <p class="text-xs text-(--cs-text-secondary) mt-0.5">{{ $t('polling_window.desc') }}</p>
        </div>

        <div class="flex bg-(--cs-bg-primary) p-1 rounded-lg border border-(--cs-border) gap-0.5">
          <button
            v-for="n in POLLING_WINDOW_OPTIONS"
            :key="n"
            @click="setPollingWindow(n)"
            class="flex-1 py-1.5 rounded-md text-sm font-medium transition-all flex flex-col items-center gap-0.5"
            :class="pollingWindowSamples === n
              ? 'bg-(--cs-accent-blue) text-white shadow-sm'
              : 'text-(--cs-text-secondary) hover:text-(--cs-text-primary)'"
          >
            <span>{{ $t('polling_window.label_samples', { n }) }}</span>
            <span class="text-[10px] opacity-70">{{ $t('polling_window.hint_ms', { ms: n }) }}</span>
          </button>
        </div>
      </section>

      <!-- ── Danger Zone ───────────────────────────────────────── -->
      <section class="cs-card flex items-center justify-between border border-(--cs-accent-red)/25">
        <div>
          <h3 class="text-base font-semibold text-(--cs-accent-red)">{{ $t('settings_danger_zone') }}</h3>
          <p class="text-xs text-(--cs-text-secondary) mt-0.5">{{ $t('settings_clear_data_message') }}</p>
        </div>
        <button @click="handleClearData"
          class="ml-6 shrink-0 px-4 py-2 text-sm rounded-lg font-medium bg-(--cs-accent-red)/10 text-(--cs-accent-red) border border-(--cs-accent-red)/30 hover:bg-(--cs-accent-red)/20 transition-colors">
          {{ $t('settings_clear_data') }}
        </button>
      </section>
    </div>

  </div>
</template>

<script setup>
import { ref, inject, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useTheme, loadTheme, applyTheme, saveTheme } from '../utils/themeManager'

const { locale, t } = useI18n()
const currentTheme = ref('dark')
const fileInput = ref(null)

const { bgImage, bgFit, bgBrightness, bgBlur, glassEnabled, glassOpacity, glassBlur } = useTheme()

const confirm = inject('confirm')

// ─── Aggressive Push Mode ─────────────────────────────────────────────────────
const PUSH_INTERVAL_OPTIONS = [16, 8, 4, 2, 1, 0]
const pushIntervalMs = ref(16)

function setPushInterval(ms) {
  pushIntervalMs.value = ms
  try { localStorage.setItem('push-interval-ms', String(ms)) } catch (e) {}
  if (window.chrome?.webview) {
    window.chrome.webview.postMessage(
      JSON.stringify({ type: 'set_push_interval', intervalMs: ms })
    )
  }
}

// ─── Polling Rate Sample Window ───────────────────────────────────────────────
const POLLING_WINDOW_OPTIONS = [100, 300, 600, 1000]
const pollingWindowSamples = ref(300)

function setPollingWindow(n) {
  pollingWindowSamples.value = n
  try { localStorage.setItem('polling-window-samples', String(n)) } catch (e) {}
  if (window.chrome?.webview) {
    window.chrome.webview.postMessage(
      JSON.stringify({ type: 'set_polling_window', samples: n })
    )
  }
}

// ─── Overlay Server Info ──────────────────────────────────────────────────────
const overlayEnabled = ref(false)
const overlayPort = ref(0)
const copiedPanelId = ref('')

// 覆盖层面板列表：每个面板对应一个独立的 OBS Browser Source。
// 日后添加新面板只需在此数组追加条目，UI 会自动渲染新行。
const overlayPanels = computed(() => {
  if (overlayPort.value <= 0) return []
  const base = `http://localhost:${overlayPort.value}`
  return [
    { id: 'sticks',  url: `${base}/#overlay` },
    { id: 'gamepad', url: `${base}/#gamepad-overlay` },
  ]
})

function copyPanelUrl(panel) {
  navigator.clipboard.writeText(panel.url).then(() => {
    copiedPanelId.value = panel.id
    setTimeout(() => { copiedPanelId.value = '' }, 2000)
  })
}

function requestOverlayInfo() {
  if (window.chrome?.webview) {
    window.chrome.webview.postMessage(JSON.stringify({ type: 'get_overlay_info' }))
  }
}

function setOverlayEnabled(val) {
  overlayEnabled.value = val
  try { localStorage.setItem('overlay-enabled', val ? 'true' : 'false') } catch (e) { console.error(e) }
  if (window.chrome?.webview) {
    window.chrome.webview.postMessage(JSON.stringify({ type: 'set_overlay_server', enabled: val }))
  }
}

// Listen for overlay_info response from backend
if (window.chrome?.webview) {
  window.chrome.webview.addEventListener('message', (event) => {
    const data = event.data
    if (data && data.type === 'overlay_info') {
      overlayPort.value = data.port || 0
    }
  })
}

const fitOptions = [
  { value: 'cover' },
  { value: 'contain' },
  { value: 'center' },
  { value: 'tile' },
]

onMounted(() => {
  currentTheme.value = localStorage.getItem('user-theme') || 'dark'
  overlayEnabled.value = localStorage.getItem('overlay-enabled') === 'true'
  loadTheme()
  requestOverlayInfo()

  // Restore push interval and sync to backend
  // 恢复推送间隔并同步到后端
  // Use null check instead of || '16' to allow 0 (real-time) to be restored correctly
  const savedIntervalRaw = localStorage.getItem('push-interval-ms')
  const savedInterval = savedIntervalRaw !== null ? parseInt(savedIntervalRaw, 10) : 16
  pushIntervalMs.value = PUSH_INTERVAL_OPTIONS.includes(savedInterval) ? savedInterval : 16
  if (window.chrome?.webview) {
    window.chrome.webview.postMessage(
      JSON.stringify({ type: 'set_push_interval', intervalMs: pushIntervalMs.value })
    )
  }

  // Restore polling window and sync to backend
  // 恢复采样窗口并同步到后端
  const savedWindow = parseInt(localStorage.getItem('polling-window-samples') || '300', 10)
  pollingWindowSamples.value = POLLING_WINDOW_OPTIONS.includes(savedWindow) ? savedWindow : 300
  if (window.chrome?.webview) {
    window.chrome.webview.postMessage(
      JSON.stringify({ type: 'set_polling_window', samples: pollingWindowSamples.value })
    )
  }
})

function setLocale(lang) {
  locale.value = lang
  try { localStorage.setItem('user-locale', lang) } catch (e) { console.error(e) }
}

function setTheme(theme) {
  currentTheme.value = theme
  document.documentElement.setAttribute('data-theme', theme)
  try { localStorage.setItem('user-theme', theme) } catch (e) { console.error(e) }
  // Sync to overlay server so OBS Browser Source picks up the new theme live.
  // 同步至覆盖层服务器，使 OBS Browser Source 实时获取新主题。
  if (window.chrome?.webview) {
    window.chrome.webview.postMessage(JSON.stringify({ type: 'update_overlay_theme', theme }))
  }
}

function triggerUpload() {
  fileInput.value?.click()
}

function onFileChange(e) {
  const file = e.target.files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (ev) => {
    // Compress image via canvas before storing to avoid localStorage quota errors
    const img = new Image()
    img.onload = () => {
      const MAX = 1920
      let w = img.width
      let h = img.height
      if (w > MAX || h > MAX) {
        if (w > h) { h = Math.round(h * MAX / w); w = MAX }
        else { w = Math.round(w * MAX / h); h = MAX }
      }
      const canvas = document.createElement('canvas')
      canvas.width = w
      canvas.height = h
      canvas.getContext('2d').drawImage(img, 0, 0, w, h)
      bgImage.value = canvas.toDataURL('image/jpeg', 0.85)
      applyTheme()
      saveTheme()
    }
    img.src = ev.target.result
  }
  reader.readAsDataURL(file)
  e.target.value = ''
}

function removeBg() {
  bgImage.value = ''
  applyTheme()
  saveTheme()
}

function setBgFit(fit) {
  bgFit.value = fit
  applyTheme()
  saveTheme()
}

function setBgBrightness(val) {
  bgBrightness.value = val
  applyTheme()
  saveTheme()
}

function setBgBlur(val) {
  bgBlur.value = val
  applyTheme()
  saveTheme()
}

function setGlassEnabled(val) {
  glassEnabled.value = val
  applyTheme()
  saveTheme()
}

function setGlassOpacity(val) {
  glassOpacity.value = val
  applyTheme()
  saveTheme()
}

function setGlassBlur(val) {
  glassBlur.value = val
  applyTheme()
  saveTheme()
}

async function handleClearData() {
  const ok = await confirm.show({
    title: t('settings_clear_data_title'),
    message: t('settings_clear_data_message'),
    confirmText: t('settings_clear_data_confirm'),
    danger: true,
  })
  if (ok && window.chrome?.webview) {
    // Clear all frontend localStorage settings before the backend deletes its AppData folder.
    // Without this, localStorage persists across restarts because it lives in the WebView2
    // user-data folder, which may differ from the AppData path the backend clears.
    // 在后端删除 AppData 文件夹之前清空前端 localStorage。
    // 若不清空，localStorage 会在重启后保留，因为它存储在 WebView2 用户数据目录中，
    // 与后端清除的 AppData 路径不一定相同。
    localStorage.clear()
    window.chrome.webview.postMessage(JSON.stringify({ type: 'clear_app_data' }))
  }
}
</script>

<style scoped>
.cs-slider {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 4px;
  border-radius: 2px;
  background: var(--cs-border);
  outline: none;
  cursor: pointer;
}

.cs-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--cs-accent-blue);
  cursor: pointer;
  box-shadow: 0 0 6px rgba(79, 140, 255, 0.5);
  transition: box-shadow 0.15s ease;
}

.cs-slider::-webkit-slider-thumb:hover {
  box-shadow: 0 0 10px rgba(79, 140, 255, 0.8);
}

.cs-slider::-moz-range-thumb {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--cs-accent-blue);
  cursor: pointer;
  border: none;
  box-shadow: 0 0 6px rgba(79, 140, 255, 0.5);
}
</style>
