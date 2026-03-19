<template>
    <div @click="$emit('toggle', no)"
        class="group relative overflow-hidden bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl sm:rounded-3xl shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer will-change-transform"
        :class="{
            'ring-1 ring-emerald-400/30 !shadow-md': isExpanded,
        }">
        <div class="relative p-4 sm:p-6 lg:p-8">

            <!-- Header Section: Number Badge -->
            <div class="flex items-center mb-4">
                <span
                    class="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-400/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-100 dark:border-emerald-400/10">
                    {{ no }}
                </span>
            </div>

            <!-- Arabic Text -->
            <div :class="{ 'mb-6': isExpanded }">
                <p :class="['text-right leading-[1.8] text-gray-800 dark:text-gray-100 font-hafs', arabSize]">
                    {{ arab }}
                </p>
            </div>

            <!-- Translation Section (simplified) -->
            <div v-if="isExpanded" class="animate-fadeIn">
                <div class="pt-6 border-t border-gray-50 dark:border-gray-700/50">
                    <p :class="['text-gray-600 dark:text-gray-300 leading-relaxed font-light italic', translationSize]">
                        "{{ translation }}"
                    </p>
                </div>
            </div>

        </div>
    </div>
</template>


<script setup>
defineProps({
    no: {
        type: Number,
        required: true,
    },
    arab: {
        type: String,
        required: true,
    },
    translation: {
        type: String,
        required: true,
    },
    isExpanded: {
        type: Boolean,
        default: false,
    },
    arabSize: {
        type: String,
        default: 'text-3xl sm:text-5xl',
    },
    translationSize: {
        type: String,
        default: 'text-sm sm:text-base',
    },
});

defineEmits(["toggle"]);
</script>

<style scoped>
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(4px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.animate-fadeIn {
    animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
</style>

