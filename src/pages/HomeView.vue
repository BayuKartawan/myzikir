<template>
  <div
    class="min-h-screen bg-linear-to-br from-slate-50 via-white to-emerald-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-emerald-950">
    <!-- Header Section -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-6">
      <div class="text-center space-y-3 mb-12 sm:mb-16">
        <div
          class="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-emerald-500/10 dark:bg-emerald-400/10 rounded-2xl mb-4">
          <span class="text-4xl sm:text-5xl">🤲</span>
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
        <!-- Loading Overlay -->
        <div v-if="isLoading" class="absolute inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-10 rounded-2xl">
          <div class="text-center">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
            <p class="text-gray-600 dark:text-gray-400">Memuat data...</p>
          </div>
        </div>

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
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { MenuCard } from '@/components';

const router = useRouter();

const selectedTable = ref('zikir_setelah_shalat');
const availableTables = ref([
  { key: 'zikir_setelah_shalat', label: 'Zikir Setelah Shalat', description: 'Bacaan zikir setelah melaksanakan shalat fardhu', icon: '📿', isPlaceholder: false },
  { key: 'doa_setelah_shalat', label: 'Doa Setelah Shalat', description: 'Bacaan doa setelah melaksanakan shalat fardhu', icon: '🤲', isPlaceholder: false },
  { key: 'placeholder1', label: 'Segera Hadir', description: 'Menu dzikir lainnya akan ditambahkan', icon: '✨', isPlaceholder: true },
]);
const isLoading = ref(false);
const error = ref(null);

const handleCardClick = async (table) => {
  if (table.isPlaceholder) return;

  isLoading.value = true;
  selectedTable.value = table.key;

  try {
    await fetchData();
  } finally {
    isLoading.value = false;
  }
};

const fetchData = async () => {
  error.value = null;

  try {
    const response = await fetch(import.meta.env.VITE_API_URL);

    if (!response.ok) {
      throw new Error('Gagal mengambil data zikir');
    }

    const result = await response.json();

    if (result.status === 'success' && result.data[selectedTable.value]) {
      const data = result.data[selectedTable.value];
      const selectedTableInfo = availableTables.value.find(t => t.key === selectedTable.value);
      const title = selectedTableInfo?.label || 'Reading View';
      const icon = selectedTableInfo?.icon || '📿';
      const subtitle = selectedTableInfo?.description || 'Ketuk kartu untuk melihat terjemahan';

      // Simpan data ke localStorage
      localStorage.setItem('readingData', JSON.stringify(data));
      localStorage.setItem('readingTitle', title);
      localStorage.setItem('readingSubtitle', subtitle);
      localStorage.setItem('readingIcon', icon);
      localStorage.setItem('selectedTable', selectedTable.value);

      router.push({ name: 'ReadingView' });
    } else {
      throw new Error('Format data tidak sesuai atau tabel tidak ditemukan');
    }
  } catch (err) {
    error.value = err.message || 'Terjadi kesalahan saat memuat data';
    console.error('Error fetching zikir:', err);
  }
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