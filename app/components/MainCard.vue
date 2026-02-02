<template>
    <div @click="$emit('toggle', no)"
        class="group relative overflow-hidden bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-3xl shadow-sm hover:shadow-2xl border border-gray-100 dark:border-gray-700/50 transition-all duration-500 cursor-pointer"
        :class="{
            'ring-2 ring-emerald-400/50 shadow-xl': isExpanded,
            'hover:-translate-y-1': !isExpanded,
        }">
        <!-- Decorative gradient overlay -->
        <div
            class="absolute inset-0 bg-linear-to-br from-emerald-500/5 to-teal-500/5 dark:from-emerald-400/5 dark:to-teal-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        </div>

        <div class="relative p-6 sm:p-8">
            <!-- Arabic Text -->
            <div :class="{ 'mb-6 sm:mb-8': isExpanded }">
                <p :class="['text-right leading-loose text-gray-800 dark:text-gray-100 font-hafs', arabSize]">
                    {{ arab }}
                </p>
            </div>

            <!-- Translation Section (expandable) -->
            <div v-if="isExpanded" class="animate-fadeIn">
                <!-- Divider -->
                <div class="border-t border-gray-100 dark:border-gray-700 my-6 sm:my-8"></div>

                <!-- Translation Box -->
                <div
                    class="bg-emerald-500/5 dark:bg-emerald-400/5 rounded-2xl p-5 sm:p-6 border border-emerald-500/10 dark:border-emerald-400/10">
                    <div class="flex items-start gap-3 mb-3">
                        <div
                            class="shrink-0 w-8 h-8 flex items-center justify-center bg-emerald-500/10 dark:bg-emerald-400/10 rounded-lg">
                            <svg class="w-4 h-4 text-emerald-600 dark:text-emerald-400" fill="none"
                                stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                            </svg>
                        </div>
                        <div class="flex-1">
                            <h3 class="text-sm font-semibold text-emerald-700 dark:text-emerald-400 mb-2">
                                Terjemahan
                            </h3>
                            <p :class="['text-gray-700 dark:text-gray-300 leading-relaxed', translationSize]">
                                {{ translation }}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Footer: Number Badge & Toggle Indicator -->
            <div class="mt-6 flex justify-between items-center">
                <!-- Number Badge -->
                <div class="flex items-center gap-3">
                    <span
                        class="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-500/10 dark:bg-emerald-400/10 text-emerald-700 dark:text-emerald-400 text-sm font-bold">
                        {{ no }}
                    </span>
                </div>

                <!-- Expand/Collapse Indicator -->
                <div class="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                    <span v-if="!isExpanded">Lihat terjemahan</span>
                    <span v-else>Sembunyikan</span>
                    <svg class="w-5 h-5 transition-transform duration-300" :class="{ 'rotate-180': isExpanded }"
                        fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
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
        default: 'text-base sm:text-lg',
    },
});

defineEmits(["toggle"]);
</script>

<style scoped>
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.animate-fadeIn {
    animation: fadeIn 0.3s ease-out;
}
</style>
