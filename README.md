# ☪️ MyZikir

Aplikasi web modern untuk membaca dzikir dan doa harian, dibangun dengan **Nuxt 4** dan terintegrasi dengan **Google Sheets** sebagai backend database melalui **Google Apps Script (GAS)**.

## ✨ Fitur Utama

- 📖 **Bacaan Zikir & Doa** — Tampilan teks Arab dan terjemahan yang rapi dengan font kustom
- 🔒 **Panel Admin** — CRUD data zikir via antarmuka web dengan autentikasi password
- 📱 **Responsif** — Desain mobile-first dengan dukungan dark mode otomatis
- ⚡ **Performa Cepat** — Caching localStorage, skeleton loader, dan background data refresh
- 🔗 **Menu Dinamis** — Konfigurasi menu dikelola dari Google Sheets (`menu_config`)
- 🔐 **URL Terenkripsi** — Route menggunakan key acak 8 karakter, bukan nama sheet langsung
- 🖨️ **Cetak & Export** — Cetak halaman bacaan atau download ke format Excel (.xlsx)
- 🖥️ **Mode Fullscreen** — Membaca tanpa gangguan dengan auto-scroll
- 📑 **Navigasi Sub Menu** — Daftar isi otomatis berdasarkan sub_menu di data
- 📄 **Pagination Admin** — Pengaturan jumlah data per halaman pada panel admin

## 🛠️ Tech Stack

| Teknologi | Versi | Keterangan |
|---|---|---|
| [Nuxt](https://nuxt.com) | 4.x | Framework fullstack Vue.js |
| [Vue](https://vuejs.org) | 3.5 | Reactive UI framework |
| [Tailwind CSS](https://tailwindcss.com) | 4.x | Utility-first CSS |
| [Nuxt Icon](https://nuxt.com/modules/icon) | 2.x | Lucide icon set |
| [SheetJS (xlsx)](https://sheetjs.com) | 0.18 | Export data ke Excel |
| [Google Apps Script](https://developers.google.com/apps-script) | - | API backend (Spreadsheet) |

## 📁 Struktur Proyek

```
myzikir/
├── app/
│   ├── assets/
│   │   └── main.css              # Global styles & Tailwind imports
│   ├── components/
│   │   ├── ActionButton.vue      # FAB action button
│   │   ├── Button.vue            # Reusable button
│   │   ├── Header.vue            # Page header
│   │   ├── MainCard.vue          # Kartu bacaan zikir (arab + terjemah)
│   │   ├── MenuCard.vue          # Kartu menu di halaman utama
│   │   └── PageContainer.vue     # Layout wrapper
│   ├── pages/
│   │   ├── index.vue             # Halaman utama (daftar menu)
│   │   ├── admin.vue             # Panel admin (CRUD + login)
│   │   └── reading/
│   │       └── [table].vue       # Halaman baca zikir (dynamic route)
│   ├── utils/
│   │   └── menu.ts               # Data fallback menu (static)
│   └── app.vue                   # Root component
├── server/
│   └── api/
│       ├── auth.post.ts          # Endpoint autentikasi admin
│       ├── zikir.get.ts          # Proxy GET ke Google Apps Script
│       └── zikir.post.ts         # Proxy POST ke Google Apps Script
├── apps-script/
│   ├── code.js                   # Google Apps Script (deploy ke GAS)
│   ├── DB-alazkar.json           # Data seed / template database
│   └── DB-alazkar.xlsx           # File Excel hasil generate
├── public/                       # Static assets
├── generate_xlsx.js              # Script generate XLSX dari JSON
├── nuxt.config.ts                # Konfigurasi Nuxt
├── .env.example                  # Template environment variables
└── package.json
```

## 🚀 Cara Instalasi & Menjalankan

### Prasyarat
- **Node.js** `^20.19.0` atau `>=22.12.0`
- **pnpm** (package manager)
- Akun Google dengan akses ke Google Sheets

### 1. Clone & Install

```bash
git clone <repo-url>
cd myzikir
pnpm install
```

### 2. Konfigurasi Environment

Salin `.env.example` menjadi `.env`:

```bash
cp .env.example .env
```

Isi dengan konfigurasi Anda:

```env
VITE_API_URL=https://script.google.com/macros/s/xxxxxx/exec
API_SECRET_KEY=your_secret_key_here
ADMIN_PASSWORD=your_admin_password_here
```

| Variable | Keterangan |
|---|---|
| `VITE_API_URL` | URL Web App dari Google Apps Script deployment |
| `API_SECRET_KEY` | Secret key untuk autentikasi ke GAS (harus sama dengan Script Properties) |
| `ADMIN_PASSWORD` | Password untuk login ke panel admin |

> ⚠️ **Penting**: File `.env` tidak di-upload ke repository. Semua secret hanya diakses di sisi server melalui `runtimeConfig`.

### 3. Jalankan Development Server

```bash
pnpm dev
```

Buka `http://localhost:3000` di browser.

### 4. Build untuk Produksi

```bash
pnpm build
pnpm preview   # Preview hasil build
```

---

## ⚙️ Setup Google Apps Script (GAS)

### 📋 Struktur Google Spreadsheet

Spreadsheet Anda harus memiliki sheet-sheet berikut:

#### Sheet `menu_config` (Konfigurasi Menu)

| Kolom | Tipe | Keterangan |
|---|---|---|
| `no` | Number | Nomor urut (primary key) |
| `key` | String | Key acak 8 karakter untuk URL (auto-generated dari admin) |
| `nama_sheet` | String | Nama sheet tabel data (harus **persis sama** dengan nama tab sheet) |
| `label` | String | Nama menu yang ditampilkan ke user |
| `description` | String | Deskripsi singkat menu |
| `icon` | String | Nama icon Lucide (misal: `lucide:book-open`) |
| `next` | String | Key menu selanjutnya untuk navigasi (opsional) |

#### Sheet Data Zikir (misal: `zikir_setelah_shalat`, `tahlil`, dll.)

| Kolom | Tipe | Keterangan |
|---|---|---|
| `no` | Number | Nomor urut (primary key) |
| `sub_menu` | String | Nama sub-bab / kategori (opsional) |
| `arab` | String | Teks bacaan Arab |
| `terjemah` | String | Terjemahan bahasa Indonesia |

> 💡 **Tips**: Nama sheet data harus menggunakan `snake_case` (huruf kecil, spasi diganti underscore).  
> Contoh: `zikir_setelah_shalat`, `doa_tahlil`, `takbiran`

### 💻 Deploy Google Apps Script

1. Buka Google Spreadsheet yang berisi data zikir Anda.
2. Klik menu **Extensions** > **Apps Script**.
3. Hapus kode bawaan dan salin/tempel seluruh isi file `apps-script/code.js` ke editor.
4. Klik **Save** (ikon disket).
5. **Konfigurasi Secret Key**:
   - Di sidebar kiri, klik **Project Settings** (ikon roda gigi).
   - Scroll ke **Script Properties** > klik **Add script property**.
   - Property: `API_SECRET_KEY`, Value: isi dengan secret key pilihan Anda.
   - Klik **Save script properties**.
6. Klik **Deploy** > **New Deployment**.
7. Pilih tipe: **Web App**.
8. **Execute as**: pilih **Me**.
9. **Who has access**: pilih **Anyone**.
10. Klik **Deploy** dan salin **Web App URL** ke `.env` (`VITE_API_URL`).

### 📊 Import Data Awal dari Template

File `apps-script/DB-alazkar.xlsx` berisi data template yang siap diimport ke Google Sheets:

```bash
# Regenerate XLSX dari JSON (jika ada perubahan pada DB-alazkar.json)
node generate_xlsx.js
```

Upload file `.xlsx` ke Google Sheets via menu **File** > **Import**.

---

## 🔒 Arsitektur Keamanan

```
Browser (Client)
    │
    ├── GET /api/zikir?table=xxx ──► Nuxt Server ──► Google Apps Script
    │   (header: sec-fetch-mode)      (+ secret)      (verifikasi secret)
    │
    ├── POST /api/zikir ───────────► Nuxt Server ──► Google Apps Script
    │   (header: x-admin-password)    (verifikasi     (verifikasi secret,
    │                                  password,       eksekusi CRUD)
    │                                  + inject secret)
    │
    └── POST /api/auth ────────────► Nuxt Server
        (body: password)              (verifikasi password)
```

### Mekanisme Keamanan

| Layer | Proteksi | Keterangan |
|---|---|---|
| **URL Route** | Key acak 8 karakter | Nama sheet tidak terekspos di URL browser |
| **API GET** | Blokir akses langsung | Menolak request `sec-fetch-mode: navigate` (akses URL manual di browser) |
| **API POST** | Password admin | Header `x-admin-password` divalidasi sebelum operasi CRUD |
| **GAS API** | Secret key | `API_SECRET_KEY` disimpan server-side, tidak terekspos ke client |
| **Environment** | Runtime config | Semua secret di `runtimeConfig` (bukan `public`), hanya server yang akses |

---

## 📄 Halaman Aplikasi

### 🏠 Beranda (`/`)
- Menampilkan daftar menu bacaan dari `menu_config`
- Data menu di-fetch dari API dengan fallback ke cache localStorage
- Placeholder "Segera Hadir" untuk menu yang akan datang

### 📖 Halaman Baca (`/reading/:key`)
- Menampilkan teks Arab dan terjemahan dengan navigasi sub-menu
- **Fitur**: pengaturan ukuran teks, auto-scroll, fullscreen, cetak, export Excel
- Skeleton loader saat loading, background refresh jika sudah ada cache
- Navigasi otomatis ke bacaan selanjutnya (jika dikonfigurasi field `next`)

### ⚙️ Panel Admin (`/admin`)
- Login dengan password admin
- Pilih tabel dari dropdown (termasuk `menu_config`)
- CRUD data: Tambah, Edit, Hapus
- Pagination dengan pengaturan jumlah data per halaman (5/10/20/50/100)
- Tambah menu baru: key otomatis di-generate, cukup isi `nama_sheet`, label, deskripsi, icon
- Hapus cache otomatis setelah operasi CRUD

---

## 📝 Catatan Penting

- **Nama sheet tidak bisa diubah lewat admin** — Harus diubah manual langsung di Google Sheets.
- **`nama_sheet` harus persis sama** dengan nama tab di Google Sheets (case-sensitive, snake_case).
- **Key URL** adalah string acak 8 karakter yang di-generate otomatis. Tidak perlu diisi manual.
- **Field `next`** di `menu_config` berisi key dari menu yang akan ditampilkan sebagai navigasi "Selanjutnya".
- File `.env` **tidak di-commit** ke repository demi keamanan.

## 📜 Lisensi

Proyek ini bersifat privat.
