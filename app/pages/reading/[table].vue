<template>
  <PageContainer>
    <!-- Background Refresh Indicator -->
    <div v-if="isRefreshing" 
      class="fixed top-4 right-4 z-[100] flex items-center gap-2 bg-emerald-500 text-white px-4 py-2 rounded-2xl border border-white/10 pointer-events-none">
      <div class="w-2 h-2 bg-white rounded-full"></div>
      <span class="text-[10px] font-bold uppercase tracking-wider">Updating</span>
    </div>

    <!-- Loading State (Skeleton Loader) -->
    <div v-if="isLoading" class="space-y-4">
      <!-- Header Skeleton -->
      <div class="bg-white dark:bg-gray-900 border-b border-gray-150 dark:border-gray-800 py-3 sm:py-4">
        <div class="max-w-4xl mx-auto px-4 flex items-center gap-3">
          <div class="w-9 h-9 bg-gray-150 dark:bg-gray-850 rounded-xl"></div>
          <div class="w-9 h-9 bg-gray-150 dark:bg-gray-850 rounded-xl"></div>
          <div class="space-y-2">
            <div class="h-4 bg-gray-200 dark:bg-gray-750 w-32 rounded-md"></div>
            <div class="h-3 bg-gray-150 dark:bg-gray-850 w-48 rounded-sm"></div>
          </div>
        </div>
      </div>
      <!-- Cards Skeletons -->
      <div class="max-w-4xl mx-auto px-2 pt-8 pb-32 sm:pt-10 sm:pb-40 space-y-4">
        <div v-for="i in 5" :key="i" class="p-6 bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 rounded-2xl space-y-4">
          <div class="flex items-center">
            <div class="w-8 h-4 bg-gray-150 dark:bg-gray-800 rounded-lg"></div>
          </div>
          <div class="h-10 bg-gray-200 dark:bg-gray-750 w-3/4 rounded-lg ml-auto"></div>
          <div class="h-px bg-gray-150 dark:bg-gray-800 my-2"></div>
          <div class="h-4 bg-gray-150 dark:bg-gray-850 w-5/6 rounded-md"></div>
        </div>
      </div>
    </div>

    <!-- Actual Content -->
    <div v-else>
      <!-- Header -->
      <Header :icon="icon" :title="title" :subtitle="subtitle">
        <template #back-button>
          <NuxtLink to="/" class="flex-shrink-0">
            <button class="flex items-center justify-center w-9 h-9 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-xl transition-colors border border-gray-150 dark:border-gray-800/50">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          </NuxtLink>
        </template>
      </Header>

      <!-- Content -->
      <div class="max-w-4xl mx-auto px-2 pt-8 pb-32 sm:pt-10 sm:pb-40">
        <!-- Zikir List -->
        <div class="space-y-2">
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
        <div v-if="zikirData.length === 0" class="text-center py-20">
          <div class="inline-flex items-center justify-center w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-2xl mb-4">
            <Icon name="lucide:search" class="text-5xl text-gray-400" />
          </div>
          <p class="text-base text-gray-500 dark:text-gray-400">Tidak ada data zikir tersedia.</p>
        </div>

        <!-- Navigation Button -->
        <div v-if="zikirData.length > 0 && nextTable" class="mt-12">
          <NuxtLink :to="'/reading/' + nextTable.key" class="group block">
            <div class="relative bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 rounded-2xl p-5 hover:border-emerald-500 dark:hover:border-emerald-500 group">
              <div class="relative flex items-center justify-between">
                <div class="flex-1 mr-4">
                  <p class="text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm font-bold mb-1 uppercase tracking-wider">Selanjutnya</p>
                  <h3 class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white leading-tight group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                    {{ nextTable.label }}
                  </h3>
                  <p class="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-1 truncate">
                    {{ nextTable.description }}
                  </p>
                </div>
                <div class="w-10 h-10 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-emerald-500 group-hover:text-white">
                  <Icon name="lucide:arrow-right" class="w-5 h-5 text-emerald-600 dark:text-emerald-400 group-hover:text-white" />
                </div>
              </div>
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Floating Action Button Menu -->
    <div v-if="!isLoading && zikirData.length > 0" class="fixed bottom-6 right-6 z-50">
      <!-- Menu Items -->
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
        <ActionButton text="Daftar Isi" @click="toggleNavigation">
          <template #icon>
            <Icon name="lucide:list" class="w-5 h-5" />
          </template>
        </ActionButton>
      </div>

      <!-- Main FAB Button -->
      <button @click="showMenu = !showMenu"
        class="w-14 h-14 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full flex items-center justify-center shrink-0">
        <Icon name="lucide:plus" class="w-6 h-6" />
      </button>
    </div>

    <!-- Settings Modal -->
    <div v-if="showSettingsModal"
      class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
      @click="showSettingsModal = false">
      <div class="bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-sm w-full border border-gray-200 dark:border-gray-800" @click.stop>
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
              class="px-3 py-2 rounded-xl text-sm font-medium" :class="arabSize === size.val
                ? 'bg-emerald-500 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'">
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
              class="px-3 py-2 rounded-xl text-sm font-medium" :class="translationSize === size.val
                ? 'bg-emerald-500 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'">
              {{ size.label }}
            </button>
          </div>
        </div>

        <button @click="showSettingsModal = false"
          class="w-full px-4 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold">
          Simpan Perubahan
        </button>
      </div>
    </div>

    <!-- Navigation Modal -->
    <div v-if="showNavigationModal"
      class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
      @click="showNavigationModal = false">
      <div
        class="bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-md w-full border border-gray-200 dark:border-gray-800"
        @click.stop>
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Icon name="lucide:list" class="text-emerald-500" />
            Daftar Isi
          </h3>
          <button @click="showNavigationModal = false"
            class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
            <Icon name="lucide:x" class="w-6 h-6" />
          </button>
        </div>

        <div class="max-h-[60vh] overflow-y-auto space-y-2 pr-2 custom-scrollbar">
          <!-- Top / Header Navigation -->
          <button @click="scrollToTop"
            class="w-full text-left px-4 py-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-100 dark:border-emerald-800/30 group flex items-center justify-between">
            <div class="flex items-center gap-3">
              <Icon name="lucide:arrow-up-circle" class="w-5 h-5" />
              <span>{{ title }}</span>
            </div>
            <Icon name="lucide:chevron-right"
              class="w-5 h-5 opacity-0 group-hover:opacity-100" />
          </button>

          <div v-if="subMenus.length > 0" class="px-4 py-1 pb-2">
            <div class="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Sub Menu</div>
          </div>

          <button v-for="menu in subMenus" :key="menu" @click="scrollToSection(menu)"
            class="w-full text-left px-4 py-2 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-950/20 text-gray-700 dark:text-gray-200 border border-transparent hover:border-emerald-100 dark:hover:border-emerald-800/30 group flex items-center justify-between">
            <span class="font-semibold group-hover:text-emerald-600 dark:group-hover:text-emerald-400">{{ menu }}</span>
            <Icon name="lucide:chevron-right"
              class="w-5 h-5 text-emerald-500 opacity-0 group-hover:opacity-100" />
          </button>
        </div>
      </div>
    </div>


  </PageContainer>
</template>

<script setup>

const route = useRoute();

// State
const zikirData = ref([]);
const title = ref('Reading View');
const subtitle = ref('Ketuk kartu untuk melihat terjemahan');
const icon = ref('lucide:book-marked');
const expandedCards = ref(new Set());
const isLoading = ref(true);
const isRefreshing = ref(false);
const arabSize = ref('text-3xl sm:text-5xl');
const translationSize = ref('text-base sm:text-lg');
const showSettingsModal = ref(false);
const showNavigationModal = ref(false);

const showMenu = ref(false);
const isFullscreen = ref(false);
const isAutoScrolling = ref(false);
let autoScrollInterval = null;

// Computed for active menu list (loaded dynamically)
const activeMenuList = ref([]);

// Computed for sub-menus
const subMenus = computed(() => {
  return zikirData.value
    .filter(item => item.sub_menu)
    .map(item => item.sub_menu);
});

// Navigation logic
const nextTable = computed(() => {
  const tableKey = route.params.table;
  const currentTable = activeMenuList.value.find(t => t.key === tableKey);
  
  if (currentTable) {
    if (currentTable.next) {
      return activeMenuList.value.find(t => t.key === currentTable.next);
    }
    const currentIndex = activeMenuList.value.findIndex(t => t.nama_sheet === currentTable.nama_sheet);
    if (currentIndex !== -1 && currentIndex < activeMenuList.value.length - 1) {
      return activeMenuList.value[currentIndex + 1];
    }
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



// Load menu configuration (sync cache first, then background refresh)
const loadMenuFromCache = () => {
  if (import.meta.server) return false;
  const cached = localStorage.getItem('zikir_cache_menu_config');
  if (cached) {
    try {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) {
        activeMenuList.value = parsed;
        return true;
      }
    } catch (e) {}
  }
  return false;
};

// Background refresh menu config (non-blocking)
const refreshMenuConfig = () => {
  fetch('/api/zikir?table=menu_config')
    .then(res => res.ok ? res.json() : null)
    .then(result => {
      if (result?.status === 'success' && Array.isArray(result.data) && result.data.length > 0) {
        activeMenuList.value = result.data;
        if (import.meta.client) {
          localStorage.setItem('zikir_cache_menu_config', JSON.stringify(result.data));
        }
      }
    })
    .catch(() => {});
};

// Fetch menu config: await only if no cache available
const fetchMenuConfig = async () => {
  const hasCache = loadMenuFromCache();
  if (hasCache) {
    // Cache loaded synchronously, refresh in background
    refreshMenuConfig();
    return;
  }
  // No cache — must await the network fetch
  try {
    const response = await fetch('/api/zikir?table=menu_config');
    if (response.ok) {
      const result = await response.json();
      if (result.status === 'success' && Array.isArray(result.data) && result.data.length > 0) {
        activeMenuList.value = result.data;
        if (import.meta.client) {
          localStorage.setItem('zikir_cache_menu_config', JSON.stringify(result.data));
        }
      }
    }
  } catch (e) {
    console.warn('Gagal memuat menu dinamis untuk bacaan:', e);
  }
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
        
        // Metadata setup from active menu config
        const selectedTableInfo = activeMenuList.value.find(t => t.nama_sheet === tableKey);
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
    isLoading.value = false;
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

      // Set title and subtitle dynamic from active menu config
      const selectedTableInfo = activeMenuList.value.find(t => t.nama_sheet === tableKey);
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
  } finally {
    isLoading.value = false;
    isRefreshing.value = false;
  }
};

// Lifecycle hooks
onMounted(async () => {
  const table = route.params.table;

  // 1. Load menu config (sync cache, or await network if no cache)
  await fetchMenuConfig();

  // 2. Set title/icon from menu list immediately (before data fetch)
  if (table) {
    const selectedTableInfo = activeMenuList.value.find(t => t.key === table);
    if (selectedTableInfo) {
      title.value = selectedTableInfo.label;
      subtitle.value = selectedTableInfo.description || subtitle.value;
      icon.value = selectedTableInfo.icon || icon.value;
    }

    // 3. Fetch actual zikir data
    const sheetToFetch = selectedTableInfo ? selectedTableInfo.nama_sheet : table.replace(/-/g, '_');
    await fetchData(sheetToFetch);
  } else {
    isLoading.value = false;
  }
  document.addEventListener('fullscreenchange', handleFullscreenChange);
});

// Watch for route changes to fetch new table data
watch(() => route.params.table, async (newTable) => {
  if (newTable) {
    // No need to re-fetch menu_config — use existing activeMenuList
    const selectedTableInfo = activeMenuList.value.find(t => t.key === newTable);
    
    // Set title/icon immediately
    if (selectedTableInfo) {
      title.value = selectedTableInfo.label;
      subtitle.value = selectedTableInfo.description || subtitle.value;
      icon.value = selectedTableInfo.icon || icon.value;
    }

    const sheetToFetch = selectedTableInfo ? selectedTableInfo.nama_sheet : newTable.replace(/-/g, '_');
    await fetchData(sheetToFetch);
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
  background: #10b981;
  border-radius: 5px;
}

::-webkit-scrollbar-thumb:hover {
  background: #059669;
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
</style>