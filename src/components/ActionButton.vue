<template>
  <button
    @click="$emit('click')"
    class="flex items-center gap-3 group"
    :aria-label="ariaLabel"
  >
    <span class="px-3 py-2 bg-gray-900/90 dark:bg-gray-800/90 text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
      {{ text }}
    </span>
    <div class="p-3 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 border border-gray-200 dark:border-gray-600 shrink-0">
      <slot name="icon">
        <component :is="icon" v-if="icon" class="w-5 h-5" />
      </slot>
    </div>
  </button>
</template>

<script setup>
defineProps({
  icon: {
    type: String,
    default: null
  },
  text: {
    type: String,
    required: true
  },
  ariaLabel: {
    type: String,
    default: ''
  }
});

defineEmits(['click']);
</script>