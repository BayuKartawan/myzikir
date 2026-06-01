<template>
  <div
    class="flex items-center gap-4 p-4 sm:p-5 rounded-2xl border border-gray-150 dark:border-gray-800 bg-white dark:bg-gray-900 cursor-pointer hover:border-emerald-500 dark:hover:border-emerald-500 group"
    :class="{ 'opacity-50 cursor-not-allowed': isPlaceholder }"
    @click="isPlaceholder ? null : $emit('click')"
  >
    <!-- Icon -->
    <div
      class="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl shrink-0"
      :class="{ 'bg-gray-100 dark:bg-gray-800': isPlaceholder }"
    >
      <Icon v-if="!isLoading" :name="icon" class="text-xl sm:text-2xl text-emerald-600 dark:text-emerald-400" />
      <div v-else class="rounded-full h-5 w-5 border-b-2 border-emerald-500"></div>
    </div>

    <!-- Content -->
    <div class="flex-1 min-w-0">
      <h2
        class="text-base sm:text-lg font-bold text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400"
        :class="{ 'group-hover:text-gray-900 dark:group-hover:text-white': isPlaceholder }"
      >
        {{ label }}
      </h2>
      <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">
        {{ description }}
      </p>
    </div>

    <!-- Arrow indicator -->
    <div
      class="text-gray-400 group-hover:text-emerald-500 shrink-0"
      v-if="!isPlaceholder"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
      </svg>
    </div>
  </div>
</template>

<script setup>
defineProps({
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