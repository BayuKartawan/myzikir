<template>
  <div
    class="min-h-screen bg-linear-to-br from-slate-50 via-white to-emerald-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-emerald-950">
    <!-- Header Section -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-6">
      <div class="text-center space-y-3 mb-12 sm:mb-16">
        <div
          class="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-emerald-500/10 dark:bg-emerald-400/10 rounded-2xl mb-4">
          <Icon name="lucide:sparkles" class="text-4xl sm:text-5xl text-emerald-600 dark:text-emerald-400" />
        </div>
        <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white tracking-tight">
          Menu Al-Adzkar
        </h1>
        <p class="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Kemudahan dalam berdzikir dan mendekatkan diri kepada Allah SWT
        </p>
      </div>

      <!-- Menu Grid -->
      <div class="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto relative">
        <MenuCard
          v-for="table in availableTables"
          :key="table.key"
          :label="table.label"
          :description="table.description"
          :icon="table.icon"
          :is-placeholder="table.isPlaceholder"
          :is-loading="false"
          @click="handleCardClick(table)"
        />
      </div>
    </div>

    <!-- Footer info -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-12">
      <div class="text-center">
        <p class="text-sm text-gray-500 dark:text-gray-500">
          Semoga bermanfaat untuk meningkatkan ibadah kita
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { availableTables as menuList } from '~/utils/menu';

const router = useRouter();

useHead({
  title: 'Menu Al-Adzkar - MyZikir',
  meta: [
    { name: 'description', content: 'Daftar menu dzikir dan doa harian' }
  ]
})

const selectedTable = ref('zikir_setelah_shalat');
const availableTables = ref([
  ...menuList,
  { key: 'placeholder1', label: 'Segera Hadir', description: 'Menu dzikir lainnya akan ditambahkan', icon: 'lucide:plus', isPlaceholder: true },
]);

const handleCardClick = (table) => {
  if (table.isPlaceholder) return;
  router.push('/reading/' + table.key);
};
</script>

<style scoped>
/* Smooth scrolling untuk seluruh halaman */
* {
  scroll-behavior: smooth;
}

/* Custom shadow untuk dark mode */
@media (prefers-color-scheme: dark) {
  .shadow-2xl {
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  }
}
</style>