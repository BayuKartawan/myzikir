<template>
  <div class="bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm border-b border-gray-100 dark:border-gray-700/50">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
      <slot name="back-button" />

      <div class="text-center space-y-3">
        <!-- Icon -->
        <div class="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-emerald-500/10 dark:bg-emerald-400/10 rounded-2xl mb-2">
          <Icon :name="icon" class="text-3xl sm:text-4xl text-emerald-600 dark:text-emerald-400" />
        </div>

        <!-- Title -->
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
          {{ title }}
        </h1>

        <!-- Subtitle -->
        <p class="text-sm sm:text-base text-gray-600 dark:text-gray-400">
          {{ subtitle }}
        </p>
      </div>
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