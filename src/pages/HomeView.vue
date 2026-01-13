<template>
  <div class="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
    <!-- Header -->
    <div class="bg-white shadow-sm sticky top-0 z-10">
      <div class="max-w-3xl mx-auto px-4 py-6">
        <h1 class="text-2xl font-semibold text-emerald-800 text-center">
          Zikir Setelah Shalat
        </h1>
      </div>
    </div>

    <!-- Content -->
    <div class="max-w-3xl mx-auto px-4 py-8">
      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p class="text-red-600">{{ error }}</p>
        <button 
          @click="fetchZikir" 
          class="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
        >
          Coba Lagi
        </button>
      </div>

      <!-- Zikir List -->
      <div v-else class="space-y-6">
        <div 
          v-for="item in zikirData" 
          :key="item.no"
          @click="toggleCard(item.no)"
          class="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all cursor-pointer"
          :class="{ 'ring-2 ring-emerald-500': expandedCards.has(item.no) }"
        >
          <!-- Arabic Text -->
          <div :class="{ 'mb-4': expandedCards.has(item.no) }">
            <p class="text-right text-2xl leading-loose text-gray-800 font-arabic">
              {{ item.arab }}
            </p>
          </div>

          <!-- Divider (only shown when expanded) -->
          <div v-if="expandedCards.has(item.no)" class="border-t border-gray-100 my-4"></div>

          <!-- Translation (only shown when expanded) -->
          <div v-if="expandedCards.has(item.no)" class="animate-fadeIn">
            <p class="text-sm text-gray-600 leading-relaxed">
              {{ item.terjemah }}
            </p>
          </div>

          <!-- Number Badge (only shown when expanded) -->
          <div v-if="expandedCards.has(item.no)" class="mt-4 flex justify-end animate-fadeIn">
            <span class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 text-sm font-medium">
              {{ item.no }}
            </span>
          </div>

          <!-- Tap indicator (only shown when collapsed) -->
          <div v-if="!expandedCards.has(item.no)" class="mt-3 text-center">
            <span class="text-xs text-gray-400">Ketuk untuk melihat terjemah</span>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="!loading && !error && zikirData.length === 0" class="text-center py-20">
        <p class="text-gray-500">Tidak ada data zikir.</p>
      </div>
    </div>

    <!-- Footer -->
    <div class="max-w-3xl mx-auto px-4 py-8 text-center">
      <p class="text-sm text-gray-500">
        Total {{ zikirData.length }} zikir
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

// State
const zikirData = ref([]);
const loading = ref(false);
const error = ref(null);
const expandedCards = ref(new Set());

// API URL - ganti dengan URL API Anda
const API_URL = 'https://script.google.com/macros/s/AKfycbzXhk8BQQjyc8Ga_z4aUnrZT8OGPkTP-fhr3RFLBzRtrgBXxq2NrY77G4R1N28SKoe2/exec'; // Sesuaikan dengan API endpoint Anda

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

// Fetch on mount
onMounted(() => {
  fetchZikir();
});
</script>

<style scoped>
/* Arabic Font - pastikan Anda menambahkan font Arabic di project */
.font-arabic {
  font-family: 'Amiri', 'Traditional Arabic', 'Arial Unicode MS', serif;
}

/* Smooth scrolling */
html {
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
  animation: fadeIn 0.3s ease-in-out;
}

/* Optional: Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #059669;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #047857;
}
</style>