<template>
  <div>
    <!-- Loading State -->
    <div v-if="isCheckingAuth" class="min-h-screen bg-slate-50 dark:bg-gray-950 flex items-center justify-center">
      <div class="text-sm font-semibold text-gray-500 dark:text-gray-400">Memeriksa otentikasi...</div>
    </div>

    <!-- Login View -->
    <div v-else-if="!isAuthenticated" class="min-h-screen bg-slate-50 dark:bg-gray-950 flex flex-col justify-center items-center p-4">
      <div class="w-full max-w-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-8">
        <div class="text-center mb-6">
          <div class="w-12 h-12 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center mx-auto mb-3">
            <Icon name="lucide:lock" class="w-6 h-6" />
          </div>
          <h2 class="text-xl font-bold text-gray-900 dark:text-white">Panel Admin MyZikir</h2>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Masukkan kata sandi admin untuk mengelola data</p>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-4">
          <div>
            <label class="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">Kata Sandi</label>
            <input type="password" v-model="loginPassword" required
              class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:border-emerald-500"
              placeholder="••••••••" />
          </div>

          <div v-if="loginError" class="p-3 bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-300 border border-red-100 dark:border-red-900/30 rounded-xl text-xs flex items-center gap-2">
            <Icon name="lucide:alert-circle" class="w-4 h-4 shrink-0" />
            <span>{{ loginError }}</span>
          </div>

          <button type="submit" :disabled="isLoggingIn"
            class="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-50">
            <span v-if="isLoggingIn">Memproses...</span>
            <span v-else>Masuk</span>
          </button>
        </form>

        <div class="mt-6 pt-6 border-t border-gray-150 dark:border-gray-800 text-center">
          <NuxtLink to="/" class="text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:underline inline-flex items-center gap-1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Kembali ke Beranda
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Admin Panel View -->
    <div v-else class="min-h-screen bg-slate-50 dark:bg-gray-950 pb-20">
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
          <div class="flex items-center gap-3">
            <button @click="handleLogout"
              class="px-4 py-2 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-755 dark:text-gray-200 rounded-xl font-bold flex items-center gap-2 cursor-pointer">
              Keluar
            </button>
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
              class="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold flex items-center gap-2 cursor-pointer">
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
              <p>Tidak ada data di tabel ini.</p>
            </div>

            <div v-else class="overflow-x-auto">
              <!-- menu_config table -->
              <table v-if="selectedTable === 'menu_config'" class="w-full border-collapse text-left">
                <thead>
                  <tr class="border-b border-gray-150 dark:border-gray-800 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase">
                    <th class="py-3 px-4 w-16">No</th>
                    <th class="py-3 px-4 w-40">Nama Sheet</th>
                    <th class="py-3 px-4 w-48">Label</th>
                    <th class="py-3 px-4">Deskripsi</th>
                    <th class="py-3 px-4 w-32">Icon</th>
                    <th class="py-3 px-4 w-24 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-150 dark:divide-gray-800">
                  <tr v-for="item in paginatedZikirData" :key="item.no" class="hover:bg-gray-50/50 dark:hover:bg-gray-800/10">
                    <td class="py-4 px-4 font-semibold text-gray-900 dark:text-white">
                      <span class="inline-flex items-center justify-center w-7 h-5 rounded bg-gray-100 dark:bg-gray-800 text-xs">
                        {{ item.no }}
                      </span>
                    </td>
                    <td class="py-4 px-4 text-xs font-medium text-gray-700 dark:text-gray-300">
                      {{ item.nama_sheet }}
                    </td>
                    <td class="py-4 px-4 text-sm font-semibold text-gray-900 dark:text-white">
                      {{ item.label }}
                    </td>
                    <td class="py-4 px-4 text-sm text-gray-600 dark:text-gray-400 max-w-xs truncate" :title="item.description">
                      {{ item.description }}
                    </td>
                    <td class="py-4 px-4 text-xs">
                      <span class="inline-flex items-center gap-1.5 px-2 py-1 bg-gray-50 dark:bg-gray-800 border border-gray-150 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300">
                        <Icon :name="item.icon || 'lucide:book-open'" class="w-4 h-4 text-emerald-500" />
                        {{ item.icon }}
                      </span>
                    </td>
                    <td class="py-4 px-4 text-right whitespace-nowrap">
                      <div class="inline-flex gap-2">
                        <button @click="openEditModal(item)"
                          class="p-1.5 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/20 rounded cursor-pointer"
                          title="Edit">
                          <Icon name="lucide:edit-2" class="w-4 h-4" />
                        </button>
                        <button @click="confirmDelete(item)"
                          class="p-1.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 rounded cursor-pointer"
                          title="Hapus">
                          <Icon name="lucide:trash-2" class="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>

              <!-- standard zikir table -->
              <table v-else class="w-full border-collapse text-left">
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
                  <tr v-for="item in paginatedZikirData" :key="item.no" class="hover:bg-gray-50/50 dark:hover:bg-gray-800/10">
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
                          class="p-1.5 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/20 rounded cursor-pointer"
                          title="Edit">
                          <Icon name="lucide:edit-2" class="w-4 h-4" />
                        </button>
                        <button @click="confirmDelete(item)"
                          class="p-1.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 rounded cursor-pointer"
                          title="Hapus">
                          <Icon name="lucide:trash-2" class="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Pagination Controls -->
            <div class="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6 pt-6 border-t border-gray-150 dark:border-gray-800 text-sm">
              <div class="text-gray-500 dark:text-gray-400">
                Menampilkan <span class="font-bold text-gray-800 dark:text-gray-200">{{ startIndex }}</span> - 
                <span class="font-bold text-gray-800 dark:text-gray-200">{{ endIndex }}</span> dari 
                <span class="font-bold text-gray-800 dark:text-gray-200">{{ zikirData.length }}</span> data
              </div>

              <div class="flex items-center gap-4">
                <div class="flex items-center gap-2">
                  <span class="text-gray-500 dark:text-gray-400 text-xs whitespace-nowrap">Tampilkan:</span>
                  <select v-model="itemsPerPage" @change="currentPage = 1"
                    class="px-2 py-1 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-lg text-xs focus:outline-none focus:border-emerald-500">
                    <option :value="5">5</option>
                    <option :value="10">10</option>
                    <option :value="20">20</option>
                    <option :value="50">50</option>
                    <option :value="100">100</option>
                  </select>
                </div>

                <div class="inline-flex gap-2">
                  <button @click="currentPage--" :disabled="currentPage === 1"
                    class="px-3 py-1.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-xs font-semibold text-gray-700 dark:text-gray-300 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700">
                    Sebelumnya
                  </button>

                  <span class="px-3 py-1.5 text-xs text-gray-600 dark:text-gray-400 font-medium whitespace-nowrap">
                    Halaman {{ currentPage }} / {{ totalPages }}
                  </span>

                  <button @click="currentPage++" :disabled="currentPage === totalPages"
                    class="px-3 py-1.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-xs font-semibold text-gray-700 dark:text-gray-300 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700">
                    Berikutnya
                  </button>
                </div>
              </div>
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
            {{ isEditMode ? (selectedTable === 'menu_config' ? 'Edit Konfigurasi Menu' : 'Edit Data Zikir') : (selectedTable === 'menu_config' ? 'Tambah Menu Baru' : 'Tambah Data Zikir Baru') }}
          </h3>

          <form @submit.prevent="submitForm" class="space-y-4">
            <!-- Nomor Urut -->
            <div>
              <label class="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">Nomor Urut (no)</label>
              <input type="number" v-model.number="form.no" required :disabled="isEditMode"
                class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:border-emerald-500 disabled:opacity-50"
                placeholder="Contoh: 1" />
            </div>

            <!-- Conditionally render inputs for menu_config -->
            <template v-if="selectedTable === 'menu_config'">
              <!-- Nama Sheet -->
              <div>
                <label class="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">Nama Sheet (harus sama dengan nama tab di Google Sheets)</label>
                <input type="text" v-model="form.nama_sheet" required
                  class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:border-emerald-500"
                  placeholder="Contoh: zikir_setelah_shalat" />
                <p class="text-[10px] text-gray-400 mt-1">Gunakan huruf kecil dan underscore. Contoh: zikir_pagi, doa_tahlil</p>
              </div>



              <!-- Label -->
              <div>
                <label class="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">Label / Nama Menu</label>
                <input type="text" v-model="form.label" required
                  class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:border-emerald-500"
                  placeholder="Contoh: Zikir Pagi" />
              </div>

              <!-- Deskripsi -->
              <div>
                <label class="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">Deskripsi Singkat</label>
                <input type="text" v-model="form.description" required
                  class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:border-emerald-500"
                  placeholder="Contoh: Bacaan zikir pagi hari sesuai sunnah" />
              </div>

              <!-- Icon Lucide Dropdown -->
              <div>
                <label class="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">Icon Lucide</label>
                <select v-model="form.icon" required
                  class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:border-emerald-500">
                  <option value="lucide:book-marked">📚 Book Marked (lucide:book-marked)</option>
                  <option value="lucide:sun">☀️ Sun (lucide:sun)</option>
                  <option value="lucide:book-open">📖 Book Open (lucide:book-open)</option>
                  <option value="lucide:sunrise">🌅 Sunrise (lucide:sunrise)</option>
                  <option value="lucide:moon">🌙 Moon (lucide:moon)</option>
                </select>
              </div>

              <!-- Next Menu (Optional) -->
              <div>
                <label class="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">Menu Selanjutnya (Optional)</label>
                <input type="text" v-model="form.next"
                  class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:border-emerald-500"
                  placeholder="Contoh: doa-setelah-shalat" />
              </div>
            </template>

            <!-- Inputs for standard zikir -->
            <template v-else>
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
            </template>

            <!-- Actions -->
            <div class="flex justify-end gap-3 pt-4 border-t border-gray-150 dark:border-gray-800">
              <button type="button" @click="showFormModal = false"
                class="px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-xl font-bold cursor-pointer">
                Batal
              </button>
              <button type="submit" :disabled="isSubmitting"
                class="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold flex items-center gap-2 disabled:opacity-50 cursor-pointer">
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
            Apakah Anda yakin ingin menghapus data nomor <strong>{{ itemToDelete?.no }}</strong> dari tabel ini?
          </p>

          <div class="flex flex-col gap-2">
            <button @click="deleteItem" :disabled="isSubmitting"
              class="w-full px-4 py-3 bg-red-600 hover:bg-red-750 text-white rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer">
              <div v-if="isSubmitting" class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Ya, Hapus</span>
            </button>
            <button @click="showDeleteModal = false"
              class="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-xl font-bold cursor-pointer">
              Batal
            </button>
          </div>
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

// Authentication states
const isAuthenticated = ref(false);
const isCheckingAuth = ref(true);
const loginPassword = ref('');
const loginError = ref('');
const isLoggingIn = ref(false);

// Tables available
const tablesList = computed(() => {
  return [
    { apiKey: 'menu_config', label: 'Konfigurasi Menu (menu_config)' },
    ...menuList.map(t => ({
      apiKey: t.nama_sheet,
      label: t.label
    }))
  ];
});

// State
const selectedTable = ref('menu_config');
const zikirData = ref([]);
const isLoading = ref(false);
const isSubmitting = ref(false);
const alertMessage = ref('');
const alertType = ref('success');

// Pagination State
const currentPage = ref(1);
const itemsPerPage = ref(10);

const totalPages = computed(() => {
  return Math.ceil(zikirData.value.length / itemsPerPage.value) || 1;
});

const paginatedZikirData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return zikirData.value.slice(start, end);
});

const startIndex = computed(() => {
  return zikirData.value.length === 0 ? 0 : (currentPage.value - 1) * itemsPerPage.value + 1;
});

const endIndex = computed(() => {
  return Math.min(currentPage.value * itemsPerPage.value, zikirData.value.length);
});

// Form Modals State
const showFormModal = ref(false);
const isEditMode = ref(false);
const form = ref({
  no: null,
  sub_menu: '',
  arab: '',
  terjemah: '',
  nama_sheet: '',
  label: '',
  description: '',
  icon: 'lucide:book-open',
  next: ''
});

// Generate random 8-character key for URL obfuscation
const generateRandomKey = () => {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

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

// Handle password login
const handleLogin = async () => {
  loginError.value = '';
  isLoggingIn.value = true;
  try {
    const response = await fetch('/api/auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ password: loginPassword.value })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Kata sandi salah atau tidak valid');
    }

    // Save to sessionStorage
    sessionStorage.setItem('admin_password', loginPassword.value);
    isAuthenticated.value = true;
    loginPassword.value = '';
    
    // Load data
    await fetchZikir();
  } catch (err) {
    loginError.value = err.message || 'Gagal memverifikasi kata sandi';
  } finally {
    isLoggingIn.value = false;
  }
};

// Logout
const handleLogout = () => {
  sessionStorage.removeItem('admin_password');
  isAuthenticated.value = false;
  zikirData.value = [];
};

// Fetch data
const fetchZikir = async () => {
  isLoading.value = true;
  zikirData.value = [];
  try {
    const response = await fetch(`/api/zikir?table=${selectedTable.value}`, {
      headers: {
        'x-admin-password': sessionStorage.getItem('admin_password') || ''
      }
    });

    if (response.status === 401) {
      sessionStorage.removeItem('admin_password');
      isAuthenticated.value = false;
      throw new Error('Sesi telah berakhir atau kata sandi tidak valid');
    }

    if (!response.ok) {
      throw new Error('Gagal mengambil data dari server');
    }

    const result = await response.json();
    if (result.status === 'success') {
      zikirData.value = result.data || [];
      currentPage.value = 1; // Reset to first page
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
    terjemah: '',
    nama_sheet: '',
    label: '',
    description: '',
    icon: 'lucide:book-open',
    next: ''
  };
  showFormModal.value = true;
};

// Open Form Edit
const openEditModal = (item) => {
  isEditMode.value = true;
  form.value = {
    no: item.no,
    sub_menu: item.sub_menu || '',
    arab: item.arab || '',
    terjemah: item.terjemah || '',
    nama_sheet: item.nama_sheet || '',
    label: item.label || '',
    description: item.description || '',
    icon: item.icon || 'lucide:book-open',
    next: item.next || ''
  };
  showFormModal.value = true;
};

// Submit Add / Edit Form
const submitForm = async () => {
  isSubmitting.value = true;
  const action = isEditMode.value ? 'update' : 'create';

  const payloadItem = selectedTable.value === 'menu_config' 
    ? {
        no: form.value.no,
        key: isEditMode.value ? (zikirData.value.find(d => d.no === form.value.no)?.key || generateRandomKey()) : generateRandomKey(),
        nama_sheet: form.value.nama_sheet,
        label: form.value.label,
        description: form.value.description,
        icon: form.value.icon,
        next: form.value.next
      }
    : {
        no: form.value.no,
        sub_menu: form.value.sub_menu,
        arab: form.value.arab,
        terjemah: form.value.terjemah
      };

  try {
    const response = await fetch('/api/zikir', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-password': sessionStorage.getItem('admin_password') || ''
      },
      body: JSON.stringify({
        action,
        table: selectedTable.value,
        item: payloadItem
      })
    });

    if (response.status === 401) {
      sessionStorage.removeItem('admin_password');
      isAuthenticated.value = false;
      throw new Error('Sesi telah berakhir atau kata sandi tidak valid');
    }

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
        // Clear index menu cache too
        localStorage.removeItem(`zikir_cache_menu_config`);
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
        'Content-Type': 'application/json',
        'x-admin-password': sessionStorage.getItem('admin_password') || ''
      },
      body: JSON.stringify({
        action: 'delete',
        table: selectedTable.value,
        no: itemToDelete.value.no
      })
    });

    if (response.status === 401) {
      sessionStorage.removeItem('admin_password');
      isAuthenticated.value = false;
      throw new Error('Sesi telah berakhir atau kata sandi tidak valid');
    }

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
        localStorage.removeItem(`zikir_cache_menu_config`);
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
onMounted(async () => {
  const cachedPassword = sessionStorage.getItem('admin_password');
  if (cachedPassword) {
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password: cachedPassword })
      });
      if (response.ok) {
        isAuthenticated.value = true;
        await fetchZikir();
      } else {
        sessionStorage.removeItem('admin_password');
      }
    } catch (e) {
      // If offline or other error, clear session to be safe
      sessionStorage.removeItem('admin_password');
    }
  }
  isCheckingAuth.value = false;
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
