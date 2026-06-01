<template>
  <div class="min-h-screen bg-slate-50 dark:bg-gray-950 pb-20">
    <!-- Admin Header -->
    <div class="bg-white dark:bg-gray-900 border-b border-gray-150 dark:border-gray-800 py-6">
      <div class="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Icon name="lucide:settings-2" class="text-emerald-500" />
            Panel Admin MyZikir
          </h1>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Kelola data zikir dan doa pada Google Spreadsheet</p>
        </div>
        <NuxtLink to="/">
          <Button text="Kembali ke Beranda">
            <template #icon>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </template>
          </Button>
        </NuxtLink>
      </div>
    </div>

    <!-- Admin Content -->
    <div class="max-w-6xl mx-auto px-4 mt-8">
      <div class="bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 rounded-2xl p-6">
        <!-- Selector and Add Button -->
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-6 border-b border-gray-150 dark:border-gray-800">
          <div class="w-full sm:w-auto flex items-center gap-3">
            <label class="text-sm font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap">Pilih Tabel:</label>
            <select v-model="selectedTable" @change="handleTableChange"
              class="w-full sm:w-64 px-3 py-2 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:border-emerald-500">
              <option v-for="table in tablesList" :key="table.apiKey" :value="table.apiKey">
                {{ table.label }}
              </option>
            </select>
          </div>
          <button @click="openAddModal"
            class="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold flex items-center gap-2">
            <Icon name="lucide:plus" class="w-4 h-4" />
            Tambah Data
          </button>
        </div>

        <!-- Feedback Alert -->
        <div v-if="alertMessage" :class="[
          'mb-6 p-4 rounded-xl text-sm border flex items-start gap-2',
          alertType === 'success'
            ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300 border-emerald-100 dark:border-emerald-900/30'
            : 'bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-300 border-red-100 dark:border-red-900/30'
        ]">
          <Icon :name="alertType === 'success' ? 'lucide:check-circle' : 'lucide:alert-circle'" class="w-5 h-5 shrink-0" />
          <span>{{ alertMessage }}</span>
        </div>

        <!-- Loading State (Skeleton) -->
        <div v-if="isLoading" class="space-y-3">
          <div v-for="i in 5" :key="i" class="p-4 border border-gray-100 dark:border-gray-800 rounded-xl space-y-3">
            <div class="flex justify-between items-center">
              <div class="h-4 bg-gray-200 dark:bg-gray-700 w-12 rounded"></div>
              <div class="h-6 bg-gray-200 dark:bg-gray-700 w-24 rounded"></div>
            </div>
            <div class="h-4 bg-gray-200 dark:bg-gray-700 w-full rounded"></div>
            <div class="h-4 bg-gray-200 dark:bg-gray-700 w-5/6 rounded"></div>
          </div>
        </div>

        <!-- Data List -->
        <div v-else>
          <div v-if="zikirData.length === 0" class="text-center py-12 text-gray-500 dark:text-gray-400">
            <Icon name="lucide:search" class="text-4xl mb-2" />
            <p>Tidak ada data zikir di tabel ini.</p>
          </div>

          <div v-else class="overflow-x-auto">
            <table class="w-full border-collapse text-left">
              <thead>
                <tr class="border-b border-gray-150 dark:border-gray-800 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase">
                  <th class="py-3 px-4 w-16">No</th>
                  <th class="py-3 px-4 w-36">Sub Menu</th>
                  <th class="py-3 px-4">Teks Arab</th>
                  <th class="py-3 px-4">Terjemahan</th>
                  <th class="py-3 px-4 w-24 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-150 dark:divide-gray-800">
                <tr v-for="item in zikirData" :key="item.no" class="hover:bg-gray-50/50 dark:hover:bg-gray-800/10">
                  <td class="py-4 px-4 font-semibold text-gray-900 dark:text-white">
                    <span class="inline-flex items-center justify-center w-7 h-5 rounded bg-gray-100 dark:bg-gray-800 text-xs">
                      {{ item.no }}
                    </span>
                  </td>
                  <td class="py-4 px-4 text-xs font-medium text-gray-600 dark:text-gray-400">
                    {{ item.sub_menu || '-' }}
                  </td>
                  <td class="py-4 px-4 font-hafs text-right text-lg text-gray-900 dark:text-white leading-relaxed dir-rtl" style="direction: rtl;">
                    {{ item.arab }}
                  </td>
                  <td class="py-4 px-4 text-sm text-gray-600 dark:text-gray-400 max-w-xs truncate" :title="item.terjemah">
                    {{ item.terjemah }}
                  </td>
                  <td class="py-4 px-4 text-right whitespace-nowrap">
                    <div class="inline-flex gap-2">
                      <button @click="openEditModal(item)"
                        class="p-1.5 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/20 rounded"
                        title="Edit">
                        <Icon name="lucide:edit-2" class="w-4 h-4" />
                      </button>
                      <button @click="confirmDelete(item)"
                        class="p-1.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 rounded"
                        title="Hapus">
                        <Icon name="lucide:trash-2" class="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <div v-if="showFormModal"
      class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
      @click="showFormModal = false">
      <div class="bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-xl w-full border border-gray-200 dark:border-gray-800" @click.stop>
        <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <Icon :name="isEditMode ? 'lucide:edit-2' : 'lucide:plus'" class="text-emerald-500" />
          {{ isEditMode ? 'Edit Data Zikir' : 'Tambah Data Zikir Baru' }}
        </h3>

        <form @submit.prevent="submitForm" class="space-y-4">
          <!-- Nomor Urut -->
          <div>
            <label class="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">Nomor Urut (no)</label>
            <input type="number" v-model.number="form.no" required :disabled="isEditMode"
              class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:border-emerald-500 disabled:opacity-50"
              placeholder="Contoh: 1" />
          </div>

          <!-- Sub Menu -->
          <div>
            <label class="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">Sub Menu (opsional)</label>
            <input type="text" v-model="form.sub_menu"
              class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:border-emerald-500"
              placeholder="Contoh: Fatihah-fatihah" />
          </div>

          <!-- Teks Arab -->
          <div>
            <label class="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">Teks Arab (arab)</label>
            <textarea v-model="form.arab" required rows="3" style="direction: rtl;"
              class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:border-emerald-500 text-right font-hafs text-lg leading-relaxed"
              placeholder="بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ"></textarea>
          </div>

          <!-- Terjemah -->
          <div>
            <label class="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">Terjemahan (terjemah)</label>
            <textarea v-model="form.terjemah" required rows="3"
              class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:border-emerald-500 text-sm"
              placeholder="Dengan menyebut nama Allah Yang Maha Pengasih lagi Maha Penyayang..."></textarea>
          </div>

          <!-- Actions -->
          <div class="flex justify-end gap-3 pt-4 border-t border-gray-150 dark:border-gray-800">
            <button type="button" @click="showFormModal = false"
              class="px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-xl font-bold">
              Batal
            </button>
            <button type="submit" :disabled="isSubmitting"
              class="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold flex items-center gap-2 disabled:opacity-50">
              <div v-if="isSubmitting" class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Simpan</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal"
      class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
      @click="showDeleteModal = false">
      <div class="bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-sm w-full border border-gray-200 dark:border-gray-800 text-center" @click.stop>
        <div class="w-16 h-16 bg-red-50 dark:bg-red-950/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="lucide:trash-2" class="w-8 h-8 text-red-500" />
        </div>
        <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">Hapus Data?</h3>
        <p class="text-sm text-gray-500 dark:text-gray-400 mb-6">
          Apakah Anda yakin ingin menghapus data zikir nomor <strong>{{ itemToDelete?.no }}</strong> dari tabel ini?
        </p>

        <div class="flex flex-col gap-2">
          <button @click="deleteItem" :disabled="isSubmitting"
            class="w-full px-4 py-3 bg-red-600 hover:bg-red-750 text-white rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-50">
            <div v-if="isSubmitting" class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <span>Ya, Hapus</span>
          </button>
          <button @click="showDeleteModal = false"
            class="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-xl font-bold">
            Batal
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { availableTables as menuList } from '~/utils/menu';

// Metadata setup
useHead({
  title: 'Panel Admin - MyZikir',
  meta: [
    { name: 'description', content: 'Panel CRUD data MyZikir' }
  ]
});

// Tables available
const tablesList = computed(() => {
  return menuList.map(t => ({
    apiKey: t.apiKey,
    label: t.label
  }));
});

// State
const selectedTable = ref(tablesList.value[0]?.apiKey || 'zikir_setelah_shalat');
const zikirData = ref([]);
const isLoading = ref(false);
const isSubmitting = ref(false);
const alertMessage = ref('');
const alertType = ref('success');

// Form Modals State
const showFormModal = ref(false);
const isEditMode = ref(false);
const form = ref({
  no: null,
  sub_menu: '',
  arab: '',
  terjemah: ''
});

// Delete Modal State
const showDeleteModal = ref(false);
const itemToDelete = ref(null);

// Trigger Alert
const triggerAlert = (message, type = 'success') => {
  alertMessage.value = message;
  alertType.value = type;
  setTimeout(() => {
    alertMessage.value = '';
  }, 5000);
};

// Fetch data
const fetchZikir = async () => {
  isLoading.value = true;
  zikirData.value = [];
  try {
    const response = await fetch(`/api/zikir?table=${selectedTable.value}`);
    if (!response.ok) {
      throw new Error('Gagal mengambil data dari server');
    }
    const result = await response.json();
    if (result.status === 'success') {
      zikirData.value = result.data || [];
    } else {
      throw new Error(result.message || 'Gagal memuat data');
    }
  } catch (err) {
    triggerAlert(err.message || 'Gagal memuat data zikir', 'error');
  } finally {
    isLoading.value = false;
  }
};

// Handle select table change
const handleTableChange = () => {
  fetchZikir();
};

// Open Form Add
const openAddModal = () => {
  isEditMode.value = false;
  // Auto increment no based on current length
  const nextNo = zikirData.value.length > 0 
    ? Math.max(...zikirData.value.map(item => item.no)) + 1 
    : 1;

  form.value = {
    no: nextNo,
    sub_menu: '',
    arab: '',
    terjemah: ''
  };
  showFormModal.value = true;
};

// Open Form Edit
const openEditModal = (item) => {
  isEditMode.value = true;
  form.value = {
    no: item.no,
    sub_menu: item.sub_menu || '',
    arab: item.arab,
    terjemah: item.terjemah
  };
  showFormModal.value = true;
};

// Submit Add / Edit Form
const submitForm = async () => {
  isSubmitting.value = true;
  const action = isEditMode.value ? 'update' : 'create';

  try {
    const response = await fetch('/api/zikir', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        action,
        table: selectedTable.value,
        item: {
          no: form.value.no,
          sub_menu: form.value.sub_menu,
          arab: form.value.arab,
          terjemah: form.value.terjemah
        }
      })
    });

    if (!response.ok) {
      throw new Error('Gagal mengirim permintaan ke server');
    }

    const result = await response.json();

    if (result.status === 'success') {
      triggerAlert(result.message || 'Data berhasil disimpan', 'success');
      showFormModal.value = false;
      
      // Clear cache local storage
      if (import.meta.client) {
        localStorage.removeItem(`zikir_cache_${selectedTable.value}`);
      }
      
      // Reload list
      await fetchZikir();
    } else {
      throw new Error(result.message || 'Gagal menyimpan data');
    }
  } catch (err) {
    triggerAlert(err.message || 'Gagal menyimpan data', 'error');
  } finally {
    isSubmitting.value = false;
  }
};

// Confirm Delete
const confirmDelete = (item) => {
  itemToDelete.value = item;
  showDeleteModal.value = true;
};

// Delete Item
const deleteItem = async () => {
  if (!itemToDelete.value) return;
  isSubmitting.value = true;

  try {
    const response = await fetch('/api/zikir', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        action: 'delete',
        table: selectedTable.value,
        no: itemToDelete.value.no
      })
    });

    if (!response.ok) {
      throw new Error('Gagal mengirim permintaan hapus');
    }

    const result = await response.json();

    if (result.status === 'success') {
      triggerAlert(result.message || 'Data berhasil dihapus', 'success');
      showDeleteModal.value = false;
      
      // Clear cache local storage
      if (import.meta.client) {
        localStorage.removeItem(`zikir_cache_${selectedTable.value}`);
      }
      
      // Reload list
      await fetchZikir();
    } else {
      throw new Error(result.message || 'Gagal menghapus data');
    }
  } catch (err) {
    triggerAlert(err.message || 'Gagal menghapus data', 'error');
  } finally {
    isSubmitting.value = false;
    itemToDelete.value = null;
  }
};

// Lifecycle mount
onMounted(() => {
  fetchZikir();
});
</script>

<style scoped>
/* Custom scrollbar for admin page overflow table */
.overflow-x-auto::-webkit-scrollbar {
  height: 6px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
}

.dark .overflow-x-auto::-webkit-scrollbar-thumb {
  background: #334155;
}
</style>
