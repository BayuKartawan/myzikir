<template>
  <div class="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 sticky top-0 z-40 backdrop-blur-md bg-white/95 dark:bg-gray-900/95">
    <div class="max-w-4xl mx-auto px-4 py-3 sm:py-4 flex items-center justify-between gap-4">
      <div class="flex items-center gap-3 min-w-0">
        <!-- Back Button slot -->
        <slot name="back-button" />

        <!-- Icon & Title Stack -->
        <div class="flex items-center gap-2.5 min-w-0">
          <div class="flex-shrink-0 flex items-center justify-center w-9 h-9 bg-emerald-500/10 dark:bg-emerald-400/10 rounded-xl">
            <Icon :name="icon" class="text-xl text-emerald-600 dark:text-emerald-400" />
          </div>
          <div class="min-w-0">
            <h1 class="text-base sm:text-lg font-bold text-gray-900 dark:text-white truncate">
              {{ title }}
            </h1>
            <p class="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 truncate hidden xs:block">
              {{ subtitle }}
            </p>
          </div>
        </div>
      </div>

      <!-- Right actions slot or empty -->
      <slot name="actions" />
    </div>
  </div>
</template>

<script setup>
defineProps({
  icon: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    required: true
  }
});
</script>