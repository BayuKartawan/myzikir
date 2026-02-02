<template>
  <PageContainer>
    <!-- Header -->
    <Header :icon="icon" :title="title" :subtitle="subtitle">
      <template #back-button>
        <div class="mb-6 flex w-full justify-between ">
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
          <div class="flex gap-3">
            <Button text="Cetak" @click="printData">
              <template #icon>
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
              </template>
            </Button>
            <Button text="Download Excel" @click="downloadExcel">
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
    <div class="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-10">

      <!-- Loading State -->
      <div v-if="isLoading" class="text-center py-20">
        <div class="inline-flex items-center justify-center w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-2xl mb-4">
          <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-500"></div>
        </div>
        <p class="text-base text-gray-500 dark:text-gray-400">Memuat data zikir...</p>
      </div>

      <!-- Zikir List -->
      <div v-else class="space-y-6">
        <MainCard v-for="item in zikirData" :key="item.no" :no="item.no" :arab="item.arab" :translation="item.terjemah"
          :is-expanded="expandedCards.has(item.no)" :arab-size="arabSize" :translation-size="translationSize" @toggle="toggleCard" />
      </div>

      <!-- Empty State -->
      <div v-if="!isLoading && zikirData.length === 0" class="text-center py-20">
        <div class="inline-flex items-center justify-center w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-2xl mb-4">
          <Icon name="lucide:search" class="text-5xl text-gray-400" />
        </div>
        <p class="text-base text-gray-500 dark:text-gray-400">Tidak ada data zikir tersedia.</p>
      </div>
    </div>

    <!-- Floating Action Button Menu -->
    <div class="fixed bottom-6 right-6 z-50">
      <!-- Menu Items (appear when FAB is clicked) -->
      <transition name="menu-fade">
        <div v-if="showMenu" class="absolute bottom-16 right-0 flex flex-col items-end gap-3 mb-2">
          <!-- Settings -->
          <ActionButton text="Pengaturan Teks" aria-label="Settings" @click="toggleSettings">
            <template #icon>
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </template>
          </ActionButton>

          <!-- Auto Scroll -->
          <ActionButton :text="isAutoScrolling ? 'Stop Auto Scroll' : 'Auto Scroll'" aria-label="Auto scroll"
            @click="toggleAutoScroll">
            <template #icon>
              <svg v-if="!isAutoScrolling" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </template>
          </ActionButton>

          <!-- Fullscreen -->
          <ActionButton :text="isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'" aria-label="Toggle fullscreen"
            @click="toggleFullscreen">
            <template #icon>
              <svg v-if="!isFullscreen" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </template>
          </ActionButton>

          <!-- Scroll to Top -->
          <ActionButton v-if="showScrollTop" text="Ke Atas" aria-label="Scroll to top" @click="scrollToTop">
            <template #icon>
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </template>
          </ActionButton>
        </div>
      </transition>

      <!-- Main FAB Button -->
      <button @click="toggleMenu"
        class="p-3 bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 active:scale-95"
        :class="{ 'rotate-45': showMenu }" aria-label="Menu">
        <svg class="w-6 h-6 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>

    <!-- Settings Modal -->
    <div v-if="showSettingsModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" @click="showSettingsModal = false">
      <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 mx-4 max-w-sm w-full" @click.stop>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Pengaturan Teks</h3>
        
        <!-- Arabic Size -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Ukuran Teks Arab</label>
          <select v-model="arabSize" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
            <option value="text-2xl sm:text-4xl">Kecil</option>
            <option value="text-3xl sm:text-5xl">Sedang</option>
            <option value="text-4xl sm:text-6xl">Besar</option>
            <option value="text-5xl sm:text-7xl">Sangat Besar</option>
          </select>
        </div>
        
        <!-- Translation Size -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Ukuran Teks Terjemah</label>
          <select v-model="translationSize" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
            <option value="text-sm sm:text-base">Kecil</option>
            <option value="text-base sm:text-lg">Sedang</option>
            <option value="text-lg sm:text-xl">Besar</option>
            <option value="text-xl sm:text-2xl">Sangat Besar</option>
          </select>
        </div>
        
        <button @click="showSettingsModal = false" class="w-full px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors">
          Tutup
        </button>
      </div>
    </div>
  </PageContainer>
</template>

<script setup>
import { availableTables } from '~/utils/menu';
import * as XLSX from 'xlsx';

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
const showScrollTop = ref(false);
const showMenu = ref(false);
const isFullscreen = ref(false);
const isAutoScrolling = ref(false);
const isLoading = ref(false);
const arabSize = ref('text-3xl sm:text-5xl');
const translationSize = ref('text-base sm:text-lg');
const showSettingsModal = ref(false);
let autoScrollInterval = null;

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

// Toggle settings modal
const toggleSettings = () => {
  showSettingsModal.value = !showSettingsModal.value;
  showMenu.value = false;
};

// Toggle menu
const toggleMenu = () => {
  console.log('toggleMenu called');
  showMenu.value = !showMenu.value;
};;

// Scroll to top function
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
  showMenu.value = false;
};

// Toggle fullscreen
const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().then(() => {
      isFullscreen.value = true;
    }).catch((err) => {
      console.error('Error attempting to enable fullscreen:', err);
    });
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen().then(() => {
        isFullscreen.value = false;
      });
    }
  }
  showMenu.value = false;
};

// Toggle auto scroll
const toggleAutoScroll = () => {
  if (isAutoScrolling.value) {
    // Stop auto scroll
    if (autoScrollInterval) {
      clearInterval(autoScrollInterval);
      autoScrollInterval = null;
    }
    isAutoScrolling.value = false;
  } else {
    // Start auto scroll
    isAutoScrolling.value = true;
    autoScrollInterval = setInterval(() => {
      const currentScroll = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;

      if (currentScroll >= maxScroll) {
        // Reached bottom, stop auto scroll
        clearInterval(autoScrollInterval);
        autoScrollInterval = null;
        isAutoScrolling.value = false;
      } else {
        // Scroll down smoothly
        window.scrollBy({
          top: 1,
          behavior: 'smooth'
        });
      }
    }, 30); // Adjust speed here (lower = faster)
  }
  showMenu.value = false;
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
  showMenu.value = false;
};

// Download Excel
const downloadExcel = () => {
  const data = zikirData.value.map(item => ({
    No: item.no,
    Arab: item.arab,
    Terjemah: item.terjemah
  }));
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Zikir');
  XLSX.writeFile(wb, `${title.value}.xlsx`);
  showMenu.value = false;
};

// Handle scroll event to show/hide scroll to top button
const handleScroll = () => {
  showScrollTop.value = window.scrollY > 300;
};

// Handle fullscreen change
const handleFullscreenChange = () => {
  isFullscreen.value = !!document.fullscreenElement;
};

// Fetch data function
const fetchData = async (tableKey) => {
  isLoading.value = true;
  try {
    const response = await fetch(`/api/zikir?table=${tableKey}`);

    if (!response.ok) {
      throw new Error('Gagal mengambil data zikir');
    }

    const result = await response.json();

    if (result.status === 'success') {
      const data = result.data;
      zikirData.value = data;

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
    console.error('Error fetching zikir:', err);
  } finally {
    isLoading.value = false;
  }
};

// Lifecycle hooks
onMounted(async () => {
  const table = route.params.table;
  if (table) {
    await fetchData(table.replace(/-/g, '_'));
  }

  window.addEventListener('scroll', handleScroll);
  document.addEventListener('fullscreenchange', handleFullscreenChange);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
  document.removeEventListener('fullscreenchange', handleFullscreenChange);
  if (autoScrollInterval) {
    clearInterval(autoScrollInterval);
  }
});
</script>

<style scoped>
/* Smooth scrolling */
* {
  scroll-behavior: smooth;
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

/* Fade-slide transition for scroll to top button */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.8);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.8);
}

/* Menu fade animation for FAB menu items */
.menu-fade-enter-active {
  transition: all 0.3s ease;
}

.menu-fade-leave-active {
  transition: all 0.2s ease;
}

.menu-fade-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.menu-fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

/* Pulse animation */
@keyframes pulse {

  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
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