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
      <div class="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
        <!-- Zikir Setelah Shalat -->
        <router-link to="/dzikir-after-shalat"
          class="group relative overflow-hidden bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-3xl p-8 shadow-sm hover:shadow-2xl border border-gray-100 dark:border-gray-700/50 transition-all duration-500 hover:-translate-y-2">
          <!-- Decorative gradient -->
          <div
            class="absolute inset-0 bg-linear-to-br from-emerald-500/5 to-teal-500/5 dark:from-emerald-400/5 dark:to-teal-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          </div>

          <div class="relative">
            <!-- Icon -->
            <div
              class="flex items-center justify-center w-14 h-14 bg-emerald-500/10 dark:bg-emerald-400/10 rounded-2xl mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
              <span class="text-3xl">📿</span>
            </div>

            <!-- Content -->
            <div class="space-y-2">
              <h2
                class="text-xl font-bold text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-300">
                Zikir Setelah Shalat
              </h2>
              <p class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Bacaan zikir setelah melaksanakan shalat fardhu
              </p>
            </div>

            <!-- Arrow indicator -->
            <div
              class="flex items-center mt-6 text-emerald-600 dark:text-emerald-400 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-0 group-hover:translate-x-2">
              <span class="text-sm font-medium">Buka</span>
              <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </router-link>

        <!-- Placeholder untuk menu tambahan -->
        <div
          class="group relative overflow-hidden bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-700/50 opacity-50">
          <div class="relative">
            <div class="flex items-center justify-center w-14 h-14 bg-gray-200 dark:bg-gray-700 rounded-2xl mb-6">
              <span class="text-3xl">✨</span>
            </div>
            <div class="space-y-2">
              <h2 class="text-xl font-bold text-gray-900 dark:text-white">
                Segera Hadir
              </h2>
              <p class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Menu dzikir lainnya akan ditambahkan
              </p>
            </div>
          </div>
        </div>

        <div
          class="group relative overflow-hidden bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-700/50 opacity-50">
          <div class="relative">
            <div class="flex items-center justify-center w-14 h-14 bg-gray-200 dark:bg-gray-700 rounded-2xl mb-6">
              <span class="text-3xl">🌙</span>
            </div>
            <div class="space-y-2">
              <h2 class="text-xl font-bold text-gray-900 dark:text-white">
                Segera Hadir
              </h2>
              <p class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Menu dzikir lainnya akan ditambahkan
              </p>
            </div>
          </div>
        </div>
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
// Component logic dapat ditambahkan di sini jika diperlukan
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