# myzikir

A modern, fast, and lightweight Nuxt web application for daily Zikir and prayers, integrated with Google Sheets as its backend/API database.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Project Setup

```sh
pnpm install
```

### Compile and Hot-Reload for Development

```sh
pnpm dev
```

### Compile and Minify for Production

```sh
pnpm build
```

---

## ⚙️ Google Apps Script (GAS) API Integration

Aplikasi ini menggunakan Google Spreadsheet sebagai database utama untuk menyimpan data zikir. Layanan Google Apps Script (GAS) digunakan sebagai perantara API untuk membaca (GET) dan menulis/CRUD (POST) data tersebut.

### 📋 Struktur Google Spreadsheet (Database)
Agar API dapat berjalan dengan baik, pastikan struktur Google Spreadsheet Anda mengikuti format berikut:
1. **Nama Sheet**: Gunakan nama berformat snake_case (misal: `zikir_setelah_shalat`, `doa_setelah_shalat`, `tahlil`, `doa_tahlil`, `takbiran`).
2. **Header (Baris 1)**: Kolom pertama sampai ketiga harus diisi tepat dengan nama-nama berikut (huruf kecil):
   * **no**: Nomor urut data (berfungsi sebagai *primary key* saat CRUD)
   * **sub_menu**: Nama sub-bab/kategori (opsional)
   * **arab**: Teks bacaan Arab
   * **terjemah**: Terjemahan bahasa Indonesia

### 💻 Kode Apps Script
Kode lengkap Apps Script untuk ditaruh di editor Google Sheets Anda berada pada file:
👉 **[apps-script/code.js](file:///d:/0%20BAYU%20DEV/myzikir/apps-script/code.js)**

### 🚀 Cara Implementasi
1. Buka Google Spreadsheet yang berisi data zikir Anda.
2. Klik menu **Extensions** > **Apps Script**.
3. Hapus kode bawaan (jika ada) dan salin/tempel seluruh isi file **[code.js](file:///d:/0%20BAYU%20DEV/myzikir/apps-script/code.js)** ke editor.
4. Klik tombol **Save** (ikon disket).
5. Klik tombol **Deploy** > **New Deployment**.
6. Pada panel "Select type" (ikon gerigi), pilih **Web App**.
7. Isi deskripsi deployment (misal: "API MyZikir v2").
8. Pada bagian **Execute as**, pilih **Me**.
9. Pada bagian **Who has access**, pilih **Anyone**.
10. Klik **Deploy**.
11. Salin **Web App URL** yang muncul di layar.
12. Buka file `.env` di proyek aplikasi Anda, lalu isi variabel `VITE_API_URL` dengan URL yang baru disalin:
    ```env
    VITE_API_URL=https://script.google.com/macros/s/xxxxxx/exec
    ```

### ⚠️ Catatan Keamanan
* Jangan membagikan URL Web App Anda secara publik karena siapa saja yang memiliki tautan tersebut dapat memodifikasi (tambah/ubah/hapus) isi spreadsheet Anda.
* Selalu simpan cadangan file **[code.js](file:///d:/0%20BAYU%20DEV/myzikir/apps-script/code.js)** Anda di repositori Git ini.
