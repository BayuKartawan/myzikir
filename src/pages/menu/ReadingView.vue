<template>
  <PageContainer>
    <!-- Header -->
    <Header :icon="icon" :title="title" :subtitle="subtitle">
      <template #back-button>
        <div class="mb-6">
          <router-link to="/">
            <Button text="Kembali">
              <template #icon>
                <svg class="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
              </template>
            </Button>
          </router-link>
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
          :is-expanded="expandedCards.has(item.no)" @toggle="toggleCard" />
      </div>

      <!-- Empty State -->
      <div v-if="!isLoading && zikirData.length === 0" class="text-center py-20">
        <div class="inline-flex items-center justify-center w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-2xl mb-4">
          <span class="text-5xl">📿</span>
        </div>
        <p class="text-base text-gray-500 dark:text-gray-400">Tidak ada data zikir tersedia.</p>
      </div>
    </div>

    <!-- Floating Action Button Menu -->
    <div class="fixed bottom-6 right-6 z-50">
      <!-- Menu Items (appear when FAB is clicked) -->
      <transition name="menu-fade">
        <div v-if="showMenu" class="absolute bottom-16 right-0 flex flex-col items-end gap-3 mb-2">
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
  </PageContainer>
</template>

<script setup>
import { ref, onMounted, onUnmounted, defineProps } from 'vue';
import { PageContainer, Header, Button, ActionButton, MainCard } from '@/components';

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

// State
const zikirData = ref([]);
const title = ref('Reading View');
const subtitle = ref('Ketuk kartu untuk melihat terjemahan');
const icon = ref('📿');
const expandedCards = ref(new Set());
const showScrollTop = ref(false);
const showMenu = ref(false);
const isFullscreen = ref(false);
const isAutoScrolling = ref(false);
const isLoading = ref(false);
let autoScrollInterval = null;

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

// Toggle menu
const toggleMenu = () => {
  showMenu.value = !showMenu.value;
};

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
    const response = await fetch(import.meta.env.VITE_API_URL);

    if (!response.ok) {
      throw new Error('Gagal mengambil data zikir');
    }

    const result = await response.json();

    if (result.status === 'success' && result.data[tableKey]) {
      const data = result.data[tableKey];
      zikirData.value = data;

      // Set title and subtitle based on table
      const availableTables = [
        { key: 'zikir_setelah_shalat', label: 'Zikir Setelah Shalat', description: 'Bacaan zikir setelah melaksanakan shalat fardhu', icon: '📿' },
        { key: 'doa_setelah_shalat', label: 'Doa Setelah Shalat', description: 'Bacaan doa setelah melaksanakan shalat fardhu', icon: '🙏' },
      ];
      const selectedTableInfo = availableTables.find(t => t.key === tableKey);
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
  // Ambil data dari localStorage
  const storedData = localStorage.getItem('readingData');
  const storedTitle = localStorage.getItem('readingTitle');
  const storedSubtitle = localStorage.getItem('readingSubtitle');
  const storedIcon = localStorage.getItem('readingIcon');
  const storedSelectedTable = localStorage.getItem('selectedTable');

  if (storedData) {
    zikirData.value = JSON.parse(storedData);
    localStorage.removeItem('readingData'); // Hapus setelah digunakan
  } else if (storedSelectedTable) {
    // Jika tidak ada data tapi ada selectedTable, fetch ulang
    await fetchData(storedSelectedTable);
  }

  if (storedTitle) {
    title.value = storedTitle;
    localStorage.removeItem('readingTitle');
  }
  if (storedSubtitle) {
    subtitle.value = storedSubtitle;
    localStorage.removeItem('readingSubtitle');
  }
  if (storedIcon) {
    icon.value = storedIcon;
    localStorage.removeItem('readingIcon');
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