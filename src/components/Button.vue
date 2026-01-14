<template>
  <button
    @click="$emit('click')"
    class="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-xl transition-all duration-300 border border-gray-200 dark:border-gray-600 hover:border-emerald-300 dark:hover:border-emerald-500 group"
    :class="customClass"
  >
    <slot name="icon">
      <component :is="icon" v-if="icon" class="w-4 h-4 transition-transform group-hover:-translate-x-1" />
    </slot>
    <span>{{ text }}</span>
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
  customClass: {
    type: String,
    default: ''
  }
});

defineEmits(['click']);
</script>