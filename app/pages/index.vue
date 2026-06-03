<template>
  <div class="min-h-screen bg-slate-50 dark:bg-gray-950">
    <!-- Header Section -->
    <div class="max-w-2xl mx-auto px-4 pt-6 sm:pt-10 pb-4">
      <div class="flex items-center gap-3.5 mb-8">
        <div class="flex-shrink-0 flex items-center justify-center w-12 h-12 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl">
          <Icon name="lucide:sparkles" class="text-2xl text-emerald-600 dark:text-emerald-400" />
        </div>
        <div>
          <h1 class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white leading-tight">
            Menu Al-Adzkar
          </h1>
          <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Kemudahan dalam berdzikir dan mendekatkan diri kepada Allah SWT
          </p>
        </div>
      </div>

      <!-- Skeleton Loader for Menu Cards -->
      <div v-if="isLoading" class="flex flex-col gap-3 max-w-2xl mx-auto">
        <div v-for="i in 4" :key="i" class="p-5 bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 rounded-2xl flex items-center justify-between">
          <div class="flex items-center gap-4 w-full">
            <div class="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-xl shrink-0 animate-pulse"></div>
            <div class="space-y-2 w-full">
              <div class="h-4 bg-gray-200 dark:bg-gray-750 w-1/4 rounded-md animate-pulse"></div>
              <div class="h-3 bg-gray-150 dark:bg-gray-850 w-3/4 rounded-md animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Menu List -->
      <div v-else class="flex flex-col gap-3 max-w-2xl mx-auto">
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
const router = useRouter();

useHead({
  title: 'Menu Al-Adzkar - MyZikir',
  meta: [
    { name: 'description', content: 'Daftar menu dzikir dan doa harian' }
  ]
})

const availableTables = ref([]);
const isLoading = ref(true);

const handleCardClick = (table) => {
  if (table.isPlaceholder) return;
  router.push('/reading/' + table.key);
};

onMounted(async () => {
  if (import.meta.client) {
    const cached = localStorage.getItem('zikir_cache_menu_config');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          availableTables.value = [
            ...parsed,
            { key: 'placeholder1', label: 'Segera Hadir', description: 'Menu dzikir lainnya akan ditambahkan', icon: 'lucide:plus', isPlaceholder: true }
          ];
          isLoading.value = false;
        }
      } catch (e) {}
    }
  }

  try {
    const response = await fetch('/api/zikir?table=menu_config');
    if (response.ok) {
      const result = await response.json();
      if (result.status === 'success' && Array.isArray(result.data) && result.data.length > 0) {
        availableTables.value = [
          ...result.data,
          { key: 'placeholder1', label: 'Segera Hadir', description: 'Menu dzikir lainnya akan ditambahkan', icon: 'lucide:plus', isPlaceholder: true }
        ];
        if (import.meta.client) {
          localStorage.setItem('zikir_cache_menu_config', JSON.stringify(result.data));
        }
      }
    }
  } catch (e) {
    console.warn('Gagal memuat menu dinamis:', e);
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped>
/* Smooth scrolling untuk seluruh halaman */
* {
  scroll-behavior: smooth;
}
</style>