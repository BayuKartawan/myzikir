<template>
  <div class="min-h-screen bg-linear-to-br from-slate-50 via-white to-emerald-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-emerald-950">
    <!-- Header -->
    <div class="bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm border-b border-gray-100 dark:border-gray-700/50">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <!-- Back Button -->
        <div class="mb-6">
          <router-link 
            to="/"
            class="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-xl transition-all duration-300 border border-gray-200 dark:border-gray-600 hover:border-emerald-300 dark:hover:border-emerald-500 group"
          >
            <svg class="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            Kembali
          </router-link>
        </div>
        
        <div class="text-center space-y-3">
          <!-- Icon -->
          <div class="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-emerald-500/10 dark:bg-emerald-400/10 rounded-2xl mb-2">
            <span class="text-3xl sm:text-4xl">📿</span>
          </div>
          
          <!-- Title -->
          <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
            Zikir Setelah Shalat
          </h1>
          
          <!-- Subtitle -->
          <p class="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Ketuk kartu untuk melihat terjemahan
          </p>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
      <!-- Loading State -->
      <div v-if="loading" class="flex flex-col justify-center items-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 dark:border-emerald-400 mb-4"></div>
        <p class="text-sm text-gray-500 dark:text-gray-400">Memuat zikir...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-white dark:bg-gray-800/50 rounded-3xl p-8 text-center shadow-sm border border-gray-100 dark:border-gray-700/50">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-red-500/10 rounded-2xl mb-4">
          <span class="text-4xl">⚠️</span>
        </div>
        <p class="text-base text-gray-700 dark:text-gray-300 mb-6">{{ error }}</p>
        <button 
          @click="fetchZikir" 
          class="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-sm hover:shadow-lg"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Coba Lagi
        </button>
      </div>

      <!-- Zikir List -->
      <div v-else class="space-y-6">
        <div 
          v-for="item in zikirData" 
          :key="item.no"
          @click="toggleCard(item.no)"
          class="group relative overflow-hidden bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-3xl shadow-sm hover:shadow-2xl border border-gray-100 dark:border-gray-700/50 transition-all duration-500 cursor-pointer"
          :class="{ 
            'ring-2 ring-emerald-400/50 shadow-xl': expandedCards.has(item.no),
            'hover:-translate-y-1': !expandedCards.has(item.no)
          }"
        >
          <!-- Decorative gradient overlay -->
          <div class="absolute inset-0 bg-linear-to-br from-emerald-500/5 to-teal-500/5 dark:from-emerald-400/5 dark:to-teal-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          <div class="relative p-6 sm:p-8">
            <!-- Arabic Text -->
            <div :class="{ 'mb-6 sm:mb-8': expandedCards.has(item.no) }">
              <p class="text-right text-3xl sm:text-5xl leading-loose text-gray-800 dark:text-gray-100 font-hafs">
                {{ item.arab }}
              </p>
            </div>

            <!-- Translation Section (expandable) -->
            <div v-if="expandedCards.has(item.no)" class="animate-fadeIn">
              <!-- Divider -->
              <div class="border-t border-gray-100 dark:border-gray-700 my-6 sm:my-8"></div>
              
              <!-- Translation Box -->
              <div class="bg-emerald-500/5 dark:bg-emerald-400/5 rounded-2xl p-5 sm:p-6 border border-emerald-500/10 dark:border-emerald-400/10">
                <div class="flex items-start gap-3 mb-3">
                  <div class="shrink-0 w-8 h-8 flex items-center justify-center bg-emerald-500/10 dark:bg-emerald-400/10 rounded-lg">
                    <svg class="w-4 h-4 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                    </svg>
                  </div>
                  <div class="flex-1">
                    <h3 class="text-sm font-semibold text-emerald-700 dark:text-emerald-400 mb-2">Terjemahan</h3>
                    <p class="text-base sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                      {{ item.terjemah }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Footer: Number Badge & Toggle Indicator -->
            <div class="mt-6 flex justify-between items-center">
              <!-- Number Badge -->
              <div class="flex items-center gap-3">
                <span class="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-500/10 dark:bg-emerald-400/10 text-emerald-700 dark:text-emerald-400 text-sm font-bold">
                  {{ item.no }}
                </span>
              </div>
              
              <!-- Expand/Collapse Indicator -->
              <div class="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                <span v-if="!expandedCards.has(item.no)">Lihat terjemahan</span>
                <span v-else>Sembunyikan</span>
                <svg 
                  class="w-5 h-5 transition-transform duration-300" 
                  :class="{ 'rotate-180': expandedCards.has(item.no) }"
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="!loading && !error && zikirData.length === 0" class="text-center py-20">
        <div class="inline-flex items-center justify-center w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-2xl mb-4">
          <span class="text-5xl">📿</span>
        </div>
        <p class="text-base text-gray-500 dark:text-gray-400">Tidak ada data zikir tersedia.</p>
      </div>
    </div>

    <!-- Footer -->
    <div class="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div class="text-center">
        <div class="inline-flex items-center gap-3 px-5 py-3 bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/50">
          <div class="flex items-center gap-2">
            <div class="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse"></div>
            <p class="text-sm text-gray-600 dark:text-gray-400 font-medium">
              Total <span class="font-bold text-gray-900 dark:text-white">{{ zikirData.length }}</span> zikir
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Floating Action Button Menu -->
    <div class="fixed bottom-6 right-6 z-50">
      <!-- Menu Items (appear when FAB is clicked) -->
      <transition name="menu-fade">
        <div v-if="showMenu" class="absolute bottom-16 right-0 flex flex-col items-end gap-3 mb-2">
          <!-- Auto Scroll -->
          <button
            @click="toggleAutoScroll"
            class="flex items-center gap-3 group"
            aria-label="Auto scroll"
          >
            <span class="px-3 py-2 bg-gray-900/90 dark:bg-gray-800/90 text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {{ isAutoScrolling ? 'Stop Auto Scroll' : 'Auto Scroll' }}
            </span>
            <div class="p-3 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 border border-gray-200 dark:border-gray-600 shrink-0">
              <svg 
                v-if="!isAutoScrolling"
                class="w-5 h-5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
              <svg 
                v-else
                class="w-5 h-5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </button>

          <!-- Fullscreen -->
          <button
            @click="toggleFullscreen"
            class="flex items-center gap-3 group"
            aria-label="Toggle fullscreen"
          >
            <span class="px-3 py-2 bg-gray-900/90 dark:bg-gray-800/90 text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {{ isFullscreen ? 'Exit Fullscreen' : 'Fullscreen' }}
            </span>
            <div class="p-3 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 border border-gray-200 dark:border-gray-600 shrink-0">
              <svg 
                v-if="!isFullscreen"
                class="w-5 h-5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
              <svg 
                v-else
                class="w-5 h-5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </button>

          <!-- Scroll to Top -->
          <button
            v-if="showScrollTop"
            @click="scrollToTop"
            class="flex items-center gap-3 group"
            aria-label="Scroll to top"
          >
            <span class="px-3 py-2 bg-gray-900/90 dark:bg-gray-800/90 text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Ke Atas
            </span>
            <div class="p-3 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 border border-gray-200 dark:border-gray-600 shrink-0">
              <svg 
                class="w-5 h-5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </div>
          </button>
        </div>
      </transition>

      <!-- Main FAB Button -->
      <button
        @click="toggleMenu"
        class="p-4 bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 active:scale-95"
        :class="{ 'rotate-45': showMenu }"
        aria-label="Menu"
      >
        <svg 
          class="w-6 h-6 transition-transform duration-300" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            stroke-linecap="round" 
            stroke-linejoin="round" 
            stroke-width="2" 
            d="M12 4v16m8-8H4" 
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

// State
const zikirData = ref([]);
const loading = ref(false);
const error = ref(null);
const expandedCards = ref(new Set());
const showScrollTop = ref(false);
const showMenu = ref(false);
const isFullscreen = ref(false);
const isAutoScrolling = ref(false);
let autoScrollInterval = null;

// API URL
const API_URL = 'https://script.google.com/macros/s/AKfycbzXhk8BQQjyc8Ga_z4aUnrZT8OGPkTP-fhr3RFLBzRtrgBXxq2NrY77G4R1N28SKoe2/exec';

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

// Fetch Zikir Data
const fetchZikir = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    const response = await fetch(API_URL);
    
    if (!response.ok) {
      throw new Error('Gagal mengambil data zikir');
    }
    
    const result = await response.json();
    
    if (result.status === 'success' && result.data?.zikir_setelah_shalat) {
      zikirData.value = result.data.zikir_setelah_shalat;
    } else {
      throw new Error('Format data tidak sesuai');
    }
  } catch (err) {
    error.value = err.message || 'Terjadi kesalahan saat memuat data';
    console.error('Error fetching zikir:', err);
  } finally {
    loading.value = false;
  }
};

// Lifecycle hooks
onMounted(() => {
  fetchZikir();
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
  0%, 100% {
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