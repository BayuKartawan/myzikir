<template>
  <div
    class="group relative overflow-hidden bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-3xl p-8 shadow-sm hover:shadow-2xl border border-gray-100 dark:border-gray-700/50 transition-all duration-500 hover:-translate-y-2 cursor-pointer"
    :class="{ 'opacity-50 cursor-not-allowed': isPlaceholder }"
    @click="isPlaceholder ? null : $emit('click')"
  >
    <!-- Decorative gradient -->
    <div
      class="absolute inset-0 bg-linear-to-br from-emerald-500/5 to-teal-500/5 dark:from-emerald-400/5 dark:to-teal-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
      v-if="!isPlaceholder"
    ></div>

    <div class="relative">
      <!-- Icon -->
      <div
        class="flex items-center justify-center w-14 h-14 bg-emerald-500/10 dark:bg-emerald-400/10 rounded-2xl mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500"
        :class="{ 'bg-gray-200 dark:bg-gray-700': isPlaceholder }"
      >
        <span v-if="!isLoading" class="text-3xl">{{ icon }}</span>
        <div v-else class="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
      </div>

      <!-- Content -->
      <div class="space-y-2">
        <h2
          class="text-xl font-bold text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-300"
          :class="{ 'group-hover:text-gray-900 dark:group-hover:text-white': isPlaceholder }"
        >
          {{ label }}
        </h2>
        <p class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
          {{ description }}
        </p>
      </div>

      <!-- Arrow indicator -->
      <div
        class="flex items-center mt-6 text-emerald-600 dark:text-emerald-400 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-0 group-hover:translate-x-2"
        v-if="!isPlaceholder"
      >
        <span class="text-sm font-medium">Buka</span>
        <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  key: String,
  label: String,
  description: String,
  icon: String,
  isPlaceholder: {
    type: Boolean,
    default: false
  },
  isLoading: {
    type: Boolean,
    default: false
  }
});

defineEmits(['click']);
</script>