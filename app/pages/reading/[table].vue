<template>
  <PageContainer>
    <!-- Background Refresh Indicator -->
    <transition name="fade">
      <div v-if="isRefreshing" 
        class="fixed top-4 right-4 z-[100] flex items-center gap-2 bg-emerald-500/90 backdrop-blur-md text-white px-4 py-2 rounded-2xl shadow-xl shadow-emerald-500/20 border border-white/20 animate-pulse pointer-events-none">
        <div class="w-2 h-2 bg-white rounded-full animate-bounce"></div>
        <span class="text-[10px] font-bold uppercase tracking-wider">Updating</span>
      </div>
    </transition>

    <!-- Header -->
    <Header :icon="icon" :title="title" :subtitle="subtitle">
      <template #back-button>
        <div class="mb-6 flex w-full justify-between items-center">
          <NuxtLink to="/">
            <Button text="Kembali">
              <template #icon>
                <svg class="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
              </template>
            </Button>
          </NuxtLink>
          <div class="flex gap-2">
            <Button text="Cetak" @click="printData">
              <template #icon>
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
              </template>
            </Button>
            <Button text="Excel" @click="showDownloadExcelModal = true">
              <template #icon>
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </template>
            </Button>
          </div>
        </div>
      </template>
    </Header>

    <!-- Content -->
    <div class="max-w-4xl mx-auto px-2 pt-8 pb-32 sm:pt-10 sm:pb-40">
      <!-- Loading State -->
      <div v-if="isLoading" class="text-center py-20">
        <div class="inline-flex items-center justify-center w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-2xl mb-4">
          <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-500"></div>
        </div>
        <p class="text-base text-gray-500 dark:text-gray-400">Memuat data zikir...</p>
      </div>

      <!-- Zikir List -->
      <div v-else class="space-y-2">
        <template v-for="(item, index) in zikirData" :key="item.no">
          <!-- Sub-menu Header -->
          <div v-if="item.sub_menu" :id="'section-' + encodeURIComponent(item.sub_menu)" class="pt-8 pb-4">
            <div class="flex items-center gap-3 mb-2">
              <div class="h-8 w-1.5 bg-emerald-500 rounded-full"></div>
              <h2 class="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100">
                {{ item.sub_menu }}
              </h2>
            </div>
            <div class="h-px w-full bg-emerald-500/10 dark:bg-emerald-500/20"></div>
          </div>

          <MainCard :id="'card-' + item.no" :no="item.no" :arab="item.arab" :translation="item.terjemah"
            :is-expanded="expandedCards.has(item.no)" :arab-size="arabSize" :translation-size="translationSize"
            @toggle="toggleCard" />
        </template>
      </div>


      <!-- Empty State -->
      <div v-if="!isLoading && zikirData.length === 0" class="text-center py-20">
        <div class="inline-flex items-center justify-center w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-2xl mb-4">
          <Icon name="lucide:search" class="text-5xl text-gray-400" />
        </div>
        <p class="text-base text-gray-500 dark:text-gray-400">Tidak ada data zikir tersedia.</p>
      </div>

      <!-- Navigation Button -->
      <div v-if="!isLoading && zikirData.length > 0 && nextTable" class="mt-12">
        <NuxtLink :to="'/reading/' + nextTable.key" class="group block">
          <div class="relative overflow-hidden bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 sm:p-8 shadow-sm transition-all duration-500 hover:border-emerald-500/50 dark:hover:border-emerald-500/50 hover:shadow-xl hover:shadow-emerald-500/10 dark:hover:shadow-emerald-500/5 hover:-translate-y-1 active:scale-[0.98] group">
            <!-- Decorative gradient -->
            <div
              class="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 dark:from-emerald-400/5 dark:to-teal-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            </div>

            <div class="relative flex items-center justify-between">
              <div class="flex-1 mr-4">
                <p class="text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm font-bold mb-1 uppercase tracking-wider">Selanjutnya</p>
                <h3 class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white leading-tight transition-colors duration-300 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                  {{ nextTable.label }}
                </h3>
                <p class="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-1 truncate">
                  {{ nextTable.description }}
                </p>
              </div>
              <div class="w-12 h-12 sm:w-14 sm:h-14 bg-emerald-500/10 dark:bg-emerald-400/10 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-500 group-hover:bg-emerald-500 group-hover:text-white transform group-hover:scale-110 group-hover:rotate-3">
                <Icon name="lucide:arrow-right" class="w-6 h-6 text-emerald-600 dark:text-emerald-400 group-hover:text-white" />
              </div>
            </div>
          </div>
        </NuxtLink>
      </div>
    </div>

    <!-- Floating Action Button Menu -->
    <div class="fixed bottom-6 right-6 z-50">
      <!-- Menu Items -->
      <transition name="menu-fade">
        <div v-if="showMenu" class="absolute bottom-16 right-0 flex flex-col items-end gap-3 mb-2">
          
          <!-- Settings -->
          <ActionButton text="Pengaturan" @click="toggleSettings">
            <template #icon>
              <Icon name="lucide:settings-2" class="w-5 h-5" />
            </template>
          </ActionButton>

          <!-- Auto Scroll -->
          <ActionButton :text="isAutoScrolling ? 'Stop Scroll' : 'Auto Scroll'" @click="toggleAutoScroll">
            <template #icon>
              <Icon :name="isAutoScrolling ? 'lucide:pause-circle' : 'lucide:play-circle'" class="w-5 h-5" />
            </template>
          </ActionButton>

          <!-- Fullscreen -->
          <ActionButton :text="isFullscreen ? 'Exit Full' : 'Fullscreen'" @click="toggleFullscreen">
            <template #icon>
              <Icon :name="isFullscreen ? 'lucide:minimize' : 'lucide:maximize'" class="w-5 h-5" />
            </template>
          </ActionButton>

          <!-- Navigation -->
          <ActionButton v-if="zikirData.length > 0" text="Daftar Isi" @click="toggleNavigation">
            <template #icon>
              <Icon name="lucide:list" class="w-5 h-5" />
            </template>
          </ActionButton>

        </div>
      </transition>

      <!-- Main FAB Button -->
      <button @click="showMenu = !showMenu"
        class="w-14 h-14 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 active:scale-95 flex items-center justify-center shrink-0"
        :class="{ 'rotate-45': showMenu }">
        <Icon name="lucide:plus" class="w-6 h-6 transition-transform" />
      </button>
    </div>

    <div v-if="showSettingsModal"
      class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
      @click="showSettingsModal = false">
      <div class="bg-white dark:bg-gray-800 rounded-3xl p-6 max-w-sm w-full shadow-2xl animate-fadeIn" @click.stop>
        <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <Icon name="lucide:settings-2" class="text-emerald-500" />
          Pengaturan Teks
        </h3>

        <!-- Arabic Size -->
        <div class="mb-6">
          <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Ukuran Teks Arab</label>
          <div class="grid grid-cols-2 gap-2">
            <button v-for="size in [
              { label: 'Kecil', val: 'text-2xl sm:text-4xl' },
              { label: 'Sedang', val: 'text-3xl sm:text-5xl' },
              { label: 'Besar', val: 'text-4xl sm:text-6xl' },
              { label: 'Extra', val: 'text-5xl sm:text-7xl' }
            ]" :key="size.val" @click="arabSize = size.val"
              class="px-3 py-2 rounded-xl text-sm font-medium transition-all" :class="arabSize === size.val
                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'">
              {{ size.label }}
            </button>
          </div>
        </div>

        <!-- Translation Size -->
        <div class="mb-8">
          <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Ukuran Terjemah</label>
          <div class="grid grid-cols-2 gap-2">
            <button v-for="size in [
              { label: 'Kecil', val: 'text-sm sm:text-base' },
              { label: 'Sedang', val: 'text-base sm:text-lg' },
              { label: 'Besar', val: 'text-lg sm:text-xl' },
              { label: 'Extra', val: 'text-xl sm:text-2xl' }
            ]" :key="size.val" @click="translationSize = size.val"
              class="px-3 py-2 rounded-xl text-sm font-medium transition-all" :class="translationSize === size.val
                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'">
              {{ size.label }}
            </button>
          </div>
        </div>

        <button @click="showSettingsModal = false"
          class="w-full px-4 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl transition-all font-bold shadow-lg shadow-emerald-500/25">
          Simpan Perubahan
        </button>
      </div>
    </div>

    <!-- Navigation Modal -->
    <div v-if="showNavigationModal"
      class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
      @click="showNavigationModal = false">
      <div
        class="bg-white dark:bg-gray-800 rounded-3xl p-6 max-w-md w-full shadow-2xl transform transition-all animate-fadeIn"
        @click.stop>
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Icon name="lucide:list" class="text-emerald-500" />
            Daftar Isi
          </h3>
          <button @click="showNavigationModal = false"
            class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
            <Icon name="lucide:x" class="w-6 h-6" />
          </button>
        </div>

        <div class="max-h-[60vh] overflow-y-auto space-y-2 pr-2 custom-scrollbar">
          <!-- Top / Header Navigation -->
          <button @click="scrollToTop"
            class="w-full text-left px-4 py-4 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 font-bold transition-all border border-emerald-100 dark:border-emerald-800/30 group flex items-center justify-between">
            <div class="flex items-center gap-3">
              <Icon name="lucide:arrow-up-circle" class="w-5 h-5" />
              <span>{{ title }}</span>
            </div>
            <Icon name="lucide:chevron-right"
              class="w-5 h-5 opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1" />
          </button>

          <div v-if="subMenus.length > 0" class="px-4 py-1 pb-2">
            <div class="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Sub Menu</div>
          </div>

          <button v-for="menu in subMenus" :key="menu" @click="scrollToSection(menu)"
            class="w-full text-left px-4 py-2 rounded-2xl hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-gray-700 dark:text-gray-200 transition-all border border-transparent hover:border-emerald-100 dark:hover:border-emerald-800/30 group flex items-center justify-between">
            <span class="font-semibold group-hover:text-emerald-600 dark:group-hover:text-emerald-400">{{ menu }}</span>
            <Icon name="lucide:chevron-right"
              class="w-5 h-5 text-emerald-500 opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </div>

    <!-- Download Excel Modal -->
    <div v-if="showDownloadExcelModal"
      class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
      @click="showDownloadExcelModal = false">
      <div class="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-sm w-full shadow-2xl animate-fadeIn text-center"
        @click.stop>
        <div
          class="w-20 h-20 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <Icon name="lucide:file-spreadsheet" class="w-10 h-10 text-emerald-500" />
        </div>
        <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Download Excel</h3>
        <p class="text-gray-500 dark:text-gray-400 mb-8">
          Apakah Anda ingin mengunduh data "{{ title }}" dalam format Microsoft Excel (.xlsx)?
        </p>

        <div class="flex flex-col gap-3">
          <button @click="downloadExcel"
            class="w-full px-6 py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl transition-all font-bold shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2">
            <Icon name="lucide:download" class="w-5 h-5" />
            Download Sekarang
          </button>
          <button @click="showDownloadExcelModal = false"
            class="w-full px-6 py-4 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-2xl transition-all font-bold">
            Batal
          </button>
        </div>
      </div>
    </div>
  </PageContainer>
</template>

<script setup>
import { availableTables } from '~/utils/menu';

const props = defineProps({
  data: {
    type: Array,
    default: () => []
  },
  title: {
    type: String,
    default: 'Reading View'
  },
  subtitle: {
    type: String,
    default: 'Ketuk kartu untuk melihat terjemahan'
  }
});

const route = useRoute();

// State
const zikirData = ref([]);
const title = ref('Reading View');
const subtitle = ref('Ketuk kartu untuk melihat terjemahan');
const icon = ref('lucide:book-marked');
const expandedCards = ref(new Set());
const isLoading = ref(false);
const isRefreshing = ref(false); // To show background refresh status if needed
const arabSize = ref('text-3xl sm:text-5xl');
const translationSize = ref('text-base sm:text-lg');
const showSettingsModal = ref(false);
const showNavigationModal = ref(false);
const showDownloadExcelModal = ref(false);
const showMenu = ref(false);
const isFullscreen = ref(false);
const isAutoScrolling = ref(false);
let autoScrollInterval = null;

// Computed for sub-menus
const subMenus = computed(() => {
  return zikirData.value
    .filter(item => item.sub_menu)
    .map(item => item.sub_menu);
});

// Navigation logic
const nextTable = computed(() => {
  const tableKey = route.params.table;
  const currentTable = availableTables.find(t => t.key === tableKey || t.apiKey === tableKey.replace(/-/g, '_'));
  
  if (currentTable && currentTable.next) {
    return availableTables.find(t => t.key === currentTable.next);
  }
  return null;
});

// Set Dynamic Page Title
useHead({
  title: () => `${title.value} - MyZikir`,
  meta: [
    { name: 'description', content: () => subtitle.value }
  ]
})

// Toggle card expansion
const toggleCard = (no) => {
  if (expandedCards.value.has(no)) {
    expandedCards.value.delete(no);
  } else {
    expandedCards.value.add(no);
  }
  // Trigger reactivity
  expandedCards.value = new Set(expandedCards.value);
};

// Scroll to section
const scrollToSection = (headerLabel) => {
  const element = document.getElementById(`section-${encodeURIComponent(headerLabel)}`);
  if (element) {
    const headerOffset = 100;
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'auto'
    });
  }
  showNavigationModal.value = false;
};

// Scroll to top
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'auto'
  });
  showNavigationModal.value = false;
};

// Action Button Handlers
const toggleSettings = () => {
  showSettingsModal.value = true;
  showMenu.value = false;
};

const toggleNavigation = () => {
  showNavigationModal.value = true;
  showMenu.value = false;
};

const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().then(() => {
      isFullscreen.value = true;
    }).catch(() => {});
  } else {
    document.exitFullscreen().then(() => {
      isFullscreen.value = false;
    });
  }
  showMenu.value = false;
};

const toggleAutoScroll = () => {
  if (isAutoScrolling.value) {
    if (autoScrollInterval) clearInterval(autoScrollInterval);
    autoScrollInterval = null;
    isAutoScrolling.value = false;
  } else {
    isAutoScrolling.value = true;
    autoScrollInterval = setInterval(() => {
      const currentScroll = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (currentScroll >= maxScroll) {
        clearInterval(autoScrollInterval);
        autoScrollInterval = null;
        isAutoScrolling.value = false;
      } else {
        window.scrollBy(0, 1);
      }
    }, 40);
  }
  showMenu.value = false;
};

const handleFullscreenChange = () => {
  isFullscreen.value = !!document.fullscreenElement;
};

// Print data
const printData = () => {
  const printWindow = window.open('', '_blank');
  const html = `
    <html>
      <head>
        <title>${title.value}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .item { margin-bottom: 20px; border-bottom: 1px solid #ccc; padding-bottom: 10px; }
          .arab { font-size: 24px; direction: rtl; text-align: right; }
          .translation { font-size: 16px; margin-top: 10px; }
        </style>
      </head>
      <body>
        <h1>${title.value}</h1>
        <p>${subtitle.value}</p>
        ${zikirData.value.map(item => `
          ${item.sub_menu ? `<h2 style="margin-top: 30px; color: #059669; border-bottom: 2px solid #059669;">${item.sub_menu}</h2>` : ''}
          <div class="item">
            <div class="arab">${item.arab}</div>
            <div class="translation">${item.terjemah}</div>
          </div>
        `).join('')}
      </body>
    </html>
  `;
  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.print();
};

// Download Excel
const downloadExcel = async () => {
  const XLSX = await import('xlsx/xlsx.mjs');
  const data = zikirData.value.map(item => ({
    No: item.no,
    'Sub Menu': item.sub_menu || '',
    Arab: item.arab,
    Terjemah: item.terjemah
  }));
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Zikir');
  XLSX.writeFile(wb, `${title.value}.xlsx`);
  showDownloadExcelModal.value = false;
};

// Function to load from cache
const loadCache = (tableKey) => {
  if (import.meta.server) return false;
  
  const cacheKey = `zikir_cache_${tableKey}`;
  const cached = localStorage.getItem(cacheKey);
  
  if (cached) {
    try {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) {
        zikirData.value = parsed;
        
        // Metadata setup from available tables for quick header update
        const selectedTableInfo = availableTables.find(t => t.apiKey === tableKey);
        if (selectedTableInfo) {
          title.value = selectedTableInfo.label;
          subtitle.value = selectedTableInfo.description;
          icon.value = selectedTableInfo.icon;
        }
        return true;
      }
    } catch (e) {
      console.error('Error parsing cache:', e);
    }
  }
  return false;
};

// Fetch data function
const fetchData = async (tableKey) => {
  const hasCache = loadCache(tableKey);
  
  // Show full loading spinner only if we don't have cache data
  if (!hasCache) {
    zikirData.value = [];
    isLoading.value = true;
  } else {
    isRefreshing.value = true;
  }

  try {
    const response = await fetch(`/api/zikir?table=${tableKey}`);

    if (!response.ok) {
      throw new Error('Gagal mengambil data zikir');
    }

    const result = await response.json();

    if (result.status === 'success') {
      const data = result.data;
      zikirData.value = data;

      // Save to localStorage for future use
      if (import.meta.client) {
        localStorage.setItem(`zikir_cache_${tableKey}`, JSON.stringify(data));
      }

      // Set title and subtitle dynamic from menu config
      const selectedTableInfo = availableTables.find(t => t.apiKey === tableKey);
      if (selectedTableInfo) {
        title.value = selectedTableInfo.label;
        subtitle.value = selectedTableInfo.description;
        icon.value = selectedTableInfo.icon;
      }
    } else {
      throw new Error('Format data tidak sesuai atau tabel tidak ditemukan');
    }
  } catch (err) {
    // If background fetch fails but we have cache, we just silent it
    if (!hasCache) {
      // Show some error state? For now keep it as it was (silent)
    }
  } finally {
    isLoading.value = false;
    isRefreshing.value = false;
  }
};

// Lifecycle hooks
onMounted(async () => {
  const table = route.params.table;
  if (table) {
    await fetchData(table.replace(/-/g, '_'));
  }
  document.addEventListener('fullscreenchange', handleFullscreenChange);
});

// Watch for route changes to fetch new table data
watch(() => route.params.table, (newTable) => {
  if (newTable) {
    fetchData(newTable.replace(/-/g, '_'));
    // Reset expanded cards and scroll to top when changing menu
    expandedCards.value = new Set();
    window.scrollTo({ top: 0, behavior: 'instant' });
  }
});

onUnmounted(() => {
  document.removeEventListener('fullscreenchange', handleFullscreenChange);
  if (autoScrollInterval) clearInterval(autoScrollInterval);
});
</script>

<style scoped>
/* Fade animation for background refresh */
.fade-enter-active, .fade-leave-active {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(-20px) scale(0.9);
}

/* Fade-in animation */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.4s ease-out;
}

/* Menu fade animation */
.menu-fade-enter-active, .menu-fade-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.menu-fade-enter-from, .menu-fade-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.9);
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-track {
  background: #f8fafc;
}

@media (prefers-color-scheme: dark) {
  ::-webkit-scrollbar-track {
    background: #0f172a;
  }
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, #10b981, #059669);
  border-radius: 5px;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, #059669, #047857);
}

/* Custom scrollbar for menu */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
}

.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background: #334155;
}

/* Touch feedback for mobile */
@media (hover: none) {
  .cursor-pointer:active {
    transform: scale(0.98);
  }
}

/* Custom shadow for dark mode support */
@media (prefers-color-scheme: dark) {
  .shadow-2xl {
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  }
}
</style>