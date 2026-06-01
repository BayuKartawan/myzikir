<template>
  <div class="min-h-screen bg-slate-50 dark:bg-gray-950">
    <!-- Header Section -->
    <div class="max-w-3xl mx-auto px-4 pt-8 sm:pt-12 pb-6">
      <div class="text-center space-y-3 mb-10 sm:mb-12">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-emerald-50 dark:bg-emerald-950/30 rounded-2xl mb-2">
          <Icon name="lucide:sparkles" class="text-4xl text-emerald-600 dark:text-emerald-400" />
        </div>
        <h1 class="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
          Menu Al-Adzkar
        </h1>
        <p class="text-sm sm:text-base text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
          Kemudahan dalam berdzikir dan mendekatkan diri kepada Allah SWT
        </p>
      </div>

      <!-- Menu List -->
      <div class="flex flex-col gap-3 max-w-2xl mx-auto">
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
    <div class="max-w-3xl mx-auto px-4 py-8 mt-6">
      <div class="text-center">
        <p class="text-xs sm:text-sm text-gray-400 dark:text-gray-500">
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
</style>