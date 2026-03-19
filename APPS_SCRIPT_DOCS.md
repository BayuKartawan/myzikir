# Dokumentasi Google Apps Script (GAS) untuk API MyZikir

Dokumentasi ini dibuat untuk mengamankan dan memberikan panduan konfigurasi ulang kode Google Apps Script (GAS) yang berfungsi sebagai API untuk aplikasi MyZikir.

## 📋 Struktur Database (Google Spreadsheet)

Agar API dapat berjalan dengan baik, pastikan struktur Google Spreadsheet Anda mengikuti format berikut:

1.  **Nama Sheet**: Nama sheet harus menggunakan format snake_case (misalnya: `zikir_setelah_shalat`, `doa_setelah_shalat`).
2.  **Header (Baris 1)**: Kolom pertama sampai ketiga harus berisi:
    *   **no**: Nomor urut
    *   **arab**: Teks Arab zikir/doa
    *   **terjemah**: Terjemahan bahasa Indonesia

## 💻 Kode Google Apps Script (`kode.gs`)

Salin dan tempel kode berikut ke editor Google Apps Script Anda:

```javascript
/**
 * Fungsi utama untuk menangani permintaan HTTP GET
 */
function doGet(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheets = ss.getSheets();
    const result = {};

    sheets.forEach(sheet => {
      const sheetName = sheet.getName();
      const data = sheet.getDataRange().getValues();
      
      // Jika sheet kosong (hanya header atau kurang), skip
      if (data.length <= 1) {
        result[sheetName] = [];
        return;
      }

      const headers = data[0].map(h => h.toString().toLowerCase().trim());
      const sheetData = [];

      for (let i = 1; i < data.length; i++) {
        const row = data[i];
        const item = {};
        
        // Memastikan baris tidak kosong sebelum diproses
        if (row.join('').trim() === '') continue;

        headers.forEach((header, index) => {
          item[header] = row[index];
        });
        
        sheetData.push(item);
      }
      
      result[sheetName] = sheetData;
    });

    return createJsonResponse({
      status: "success",
      data: result
    });

  } catch (error) {
    return createJsonResponse({
      status: "error",
      message: error.toString()
    }, 500);
  }
}

/**
 * Helper untuk membuat response JSON
 */
function createJsonResponse(data, statusCode = 200) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
```

## 🚀 Cara Implementasi Ulang

1.  Buka Google Spreadsheet yang berisi data zikir Anda.
2.  Klik menu **Extensions** > **Apps Script**.
3.  Hapus kode lama (jika ada) dan tempelkan kode di atas.
4.  Klik tombol **Save** (ikon disket).
5.  Klik tombol **Deploy** > **New Deployment**.
6.  Pada panel "Select type", pilih **Web App**.
7.  Isi deskripsi (misal: "API MyZikir v1").
8.  Pada bagian "Execute as", pilih **Me**.
9.  Pada bagian "Who has access", pilih **Anyone**.
10. Klik **Deploy**.
11. Salin **Web App URL** yang muncul.
12. Buka file `.env` di proyek VS Code Anda, lalu perbarui `VITE_API_URL` dengan URL yang baru saja disalin.

## ⚠️ Catatan Keamanan
*   Jangan membagikan URL Web App Anda secara publik jika data bersifat rahasia.
*   Selalu simpan cadangan kode ini di file `.md` atau repository Git Anda.
